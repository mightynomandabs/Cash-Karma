-- Create drops table for karma drops
CREATE TABLE public.drops (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sender_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  receiver_id UUID,
  amount INTEGER NOT NULL,
  message TEXT,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create reactions table for drop reactions
CREATE TABLE public.reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  emoji TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(drop_id, user_id, emoji)
);

-- Create leaderboard entries table
CREATE TABLE public.leaderboard_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  period_type TEXT NOT NULL CHECK (period_type IN ('weekly', 'all_time')),
  category TEXT NOT NULL CHECK (category IN ('droppers', 'receivers', 'streak_masters')),
  score INTEGER NOT NULL DEFAULT 0,
  rank INTEGER,
  period_start DATE NOT NULL,
  period_end DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, period_type, category, period_start)
);

-- Create social stories table for community features
CREATE TABLE public.social_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_anonymous BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create story reactions table
CREATE TABLE public.story_reactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID NOT NULL REFERENCES public.social_stories(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  reaction_type TEXT NOT NULL CHECK (reaction_type IN ('heart', 'laugh', 'smile', 'fire')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(story_id, user_id, reaction_type)
);

-- Enable Row Level Security on all tables
ALTER TABLE public.drops ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leaderboard_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.social_stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.story_reactions ENABLE ROW LEVEL SECURITY;

-- Drops policies
CREATE POLICY "Users can view all drops" ON public.drops FOR SELECT USING (true);
CREATE POLICY "Users can insert their own drops" ON public.drops FOR INSERT WITH CHECK (auth.uid() = sender_id);
CREATE POLICY "Users can update their own drops" ON public.drops FOR UPDATE USING (auth.uid() = sender_id);

-- Reactions policies
CREATE POLICY "Users can view all reactions" ON public.reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own reactions" ON public.reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own reactions" ON public.reactions FOR DELETE USING (auth.uid() = user_id);

-- Leaderboard policies
CREATE POLICY "Users can view all leaderboard entries" ON public.leaderboard_entries FOR SELECT USING (true);
CREATE POLICY "System can insert leaderboard entries" ON public.leaderboard_entries FOR INSERT WITH CHECK (true);
CREATE POLICY "System can update leaderboard entries" ON public.leaderboard_entries FOR UPDATE USING (true);

-- Social stories policies
CREATE POLICY "Users can view approved stories" ON public.social_stories FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can insert their own stories" ON public.social_stories FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own stories" ON public.social_stories FOR UPDATE USING (auth.uid() = user_id);

-- Story reactions policies
CREATE POLICY "Users can view all story reactions" ON public.story_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert their own story reactions" ON public.story_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete their own story reactions" ON public.story_reactions FOR DELETE USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX idx_drops_sender_id ON public.drops(sender_id);
CREATE INDEX idx_drops_created_at ON public.drops(created_at);
CREATE INDEX idx_reactions_drop_id ON public.reactions(drop_id);
CREATE INDEX idx_leaderboard_period_category ON public.leaderboard_entries(period_type, category, period_start);
CREATE INDEX idx_leaderboard_score ON public.leaderboard_entries(score DESC);
CREATE INDEX idx_social_stories_approved ON public.social_stories(is_approved, created_at DESC);
CREATE INDEX idx_story_reactions_story_id ON public.story_reactions(story_id);

-- Create function to update leaderboard
CREATE OR REPLACE FUNCTION public.update_leaderboard()
RETURNS TRIGGER AS $$
BEGIN
  -- Update droppers leaderboard
  INSERT INTO public.leaderboard_entries (user_id, period_type, category, score, period_start, period_end)
  SELECT 
    sender_id,
    'weekly',
    'droppers',
    COUNT(*) as score,
    DATE_TRUNC('week', CURRENT_DATE) as period_start,
    DATE_TRUNC('week', CURRENT_DATE) + INTERVAL '6 days' as period_end
  FROM public.drops
  WHERE created_at >= DATE_TRUNC('week', CURRENT_DATE)
  GROUP BY sender_id
  ON CONFLICT (user_id, period_type, category, period_start)
  DO UPDATE SET score = EXCLUDED.score, updated_at = now();
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update leaderboard when drops are created
CREATE TRIGGER update_leaderboard_on_drop
  AFTER INSERT ON public.drops
  FOR EACH ROW
  EXECUTE FUNCTION public.update_leaderboard();

-- Create function to calculate user rank
CREATE OR REPLACE FUNCTION public.get_user_rank(
  p_user_id UUID,
  p_period_type TEXT DEFAULT 'weekly',
  p_category TEXT DEFAULT 'droppers'
)
RETURNS INTEGER AS $$
DECLARE
  user_rank INTEGER;
BEGIN
  SELECT rank INTO user_rank
  FROM (
    SELECT 
      user_id,
      ROW_NUMBER() OVER (ORDER BY score DESC) as rank
    FROM public.leaderboard_entries
    WHERE period_type = p_period_type 
      AND category = p_category
      AND period_start = DATE_TRUNC('week', CURRENT_DATE)
  ) ranked
  WHERE user_id = p_user_id;
  
  RETURN user_rank;
END;
$$ LANGUAGE plpgsql; 