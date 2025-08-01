-- Enhanced drops table with all required fields
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS avatar_url TEXT;
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS upi_id TEXT;
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS matched_id UUID REFERENCES public.drops(id);
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS payment_id TEXT;
ALTER TABLE public.drops ADD COLUMN IF NOT EXISTS payout_id TEXT;

-- Update drops table constraints
ALTER TABLE public.drops DROP CONSTRAINT IF EXISTS drops_status_check;
ALTER TABLE public.drops ADD CONSTRAINT drops_status_check 
  CHECK (status IN ('pending', 'matched', 'paid', 'failed', 'cancelled'));

-- Create user profiles table (if not exists)
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  karma_points INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  total_given INTEGER DEFAULT 0,
  total_received INTEGER DEFAULT 0,
  streak_count INTEGER DEFAULT 0,
  last_active_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Create badges/achievements table
CREATE TABLE IF NOT EXISTS public.badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  icon_url TEXT,
  category TEXT NOT NULL CHECK (category IN ('streak', 'amount', 'social', 'special')),
  requirement_value INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user badges table
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_id UUID NOT NULL REFERENCES public.badges(id) ON DELETE CASCADE,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, badge_id)
);

-- Create transactions table for detailed payment tracking
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drop_id UUID REFERENCES public.drops(id) ON DELETE SET NULL,
  type TEXT NOT NULL CHECK (type IN ('drop_sent', 'drop_received', 'withdrawal', 'fee', 'bonus')),
  amount INTEGER NOT NULL,
  fee_amount INTEGER DEFAULT 0,
  net_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  razorpay_payment_id TEXT,
  razorpay_payout_id TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create payment_sessions table for Razorpay integration
CREATE TABLE IF NOT EXISTS public.payment_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  drop_id UUID NOT NULL REFERENCES public.drops(id) ON DELETE CASCADE,
  razorpay_order_id TEXT NOT NULL,
  razorpay_payment_id TEXT,
  amount INTEGER NOT NULL,
  fee_amount INTEGER NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'cancelled')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS on new tables
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_sessions ENABLE ROW LEVEL SECURITY;

-- User profiles policies
CREATE POLICY "Users can view all profiles" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (auth.uid() = user_id);

-- Badges policies
CREATE POLICY "Users can view all badges" ON public.badges FOR SELECT USING (true);
CREATE POLICY "System can manage badges" ON public.badges FOR ALL USING (true);

-- User badges policies
CREATE POLICY "Users can view all user badges" ON public.user_badges FOR SELECT USING (true);
CREATE POLICY "System can manage user badges" ON public.user_badges FOR ALL USING (true);

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON public.transactions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "System can manage transactions" ON public.transactions FOR ALL USING (true);

-- Payment sessions policies
CREATE POLICY "Users can view their own payment sessions" ON public.payment_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own payment sessions" ON public.payment_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "System can update payment sessions" ON public.payment_sessions FOR UPDATE USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_drops_matched_id ON public.drops(matched_id);
CREATE INDEX IF NOT EXISTS idx_drops_payment_id ON public.drops(payment_id);
CREATE INDEX IF NOT EXISTS idx_drops_status_amount ON public.drops(status, amount);
CREATE INDEX IF NOT EXISTS idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_drop_id ON public.transactions(drop_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_user_id ON public.payment_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_payment_sessions_drop_id ON public.payment_sessions(drop_id);

-- Insert default badges
INSERT INTO public.badges (name, description, icon_url, category, requirement_value) VALUES
('First Drop', 'Sent your first karma drop', '🎉', 'special', 1),
('Streak Master', 'Maintained a 7-day streak', '🔥', 'streak', 7),
('Generous Soul', 'Sent drops worth ₹1000+', '💝', 'amount', 1000),
('Karma Legend', 'Received 50+ drops', '👑', 'social', 50),
('Early Bird', 'One of the first 100 users', '🐦', 'special', 1),
('Social Butterfly', 'Reacted to 20+ drops', '🦋', 'social', 20),
('Big Spender', 'Sent a single drop of ₹500+', '💰', 'amount', 500),
('Lucky Receiver', 'Received a drop of ₹200+', '🍀', 'amount', 200);

-- Function to calculate and award badges
CREATE OR REPLACE FUNCTION public.check_and_award_badges(p_user_id UUID)
RETURNS VOID AS $$
DECLARE
  badge_record RECORD;
  user_stats RECORD;
BEGIN
  -- Get user statistics
  SELECT 
    COUNT(DISTINCT d.id) as total_drops_sent,
    COUNT(DISTINCT d2.id) as total_drops_received,
    COALESCE(SUM(d.amount), 0) as total_amount_sent,
    COALESCE(SUM(d2.amount), 0) as total_amount_received,
    COUNT(DISTINCT r.id) as total_reactions
  INTO user_stats
  FROM public.user_profiles up
  LEFT JOIN public.drops d ON d.sender_id = up.user_id
  LEFT JOIN public.drops d2 ON d2.receiver_id = up.user_id
  LEFT JOIN public.reactions r ON r.user_id = up.user_id
  WHERE up.user_id = p_user_id;

  -- Check each badge
  FOR badge_record IN 
    SELECT * FROM public.badges 
    WHERE id NOT IN (
      SELECT badge_id FROM public.user_badges WHERE user_id = p_user_id
    )
  LOOP
    -- Check if user qualifies for badge
    CASE badge_record.category
      WHEN 'streak' THEN
        -- Check streak (simplified logic)
        IF badge_record.requirement_value <= 7 THEN
          INSERT INTO public.user_badges (user_id, badge_id) 
          VALUES (p_user_id, badge_record.id);
        END IF;
      WHEN 'amount' THEN
        -- Check amount-based badges
        IF (badge_record.name = 'Big Spender' AND user_stats.total_amount_sent >= badge_record.requirement_value) OR
           (badge_record.name = 'Lucky Receiver' AND user_stats.total_amount_received >= badge_record.requirement_value) OR
           (badge_record.name = 'Generous Soul' AND user_stats.total_amount_sent >= badge_record.requirement_value) THEN
          INSERT INTO public.user_badges (user_id, badge_id) 
          VALUES (p_user_id, badge_record.id);
        END IF;
      WHEN 'social' THEN
        -- Check social badges
        IF (badge_record.name = 'Karma Legend' AND user_stats.total_drops_received >= badge_record.requirement_value) OR
           (badge_record.name = 'Social Butterfly' AND user_stats.total_reactions >= badge_record.requirement_value) THEN
          INSERT INTO public.user_badges (user_id, badge_id) 
          VALUES (p_user_id, badge_record.id);
        END IF;
      WHEN 'special' THEN
        -- Check special badges
        IF (badge_record.name = 'First Drop' AND user_stats.total_drops_sent >= 1) THEN
          INSERT INTO public.user_badges (user_id, badge_id) 
          VALUES (p_user_id, badge_record.id);
        END IF;
    END CASE;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Function to match pending drops
CREATE OR REPLACE FUNCTION public.match_pending_drops()
RETURNS INTEGER AS $$
DECLARE
  matched_count INTEGER := 0;
  drop_record RECORD;
  matched_drop RECORD;
BEGIN
  -- Find pending drops that can be matched
  FOR drop_record IN 
    SELECT * FROM public.drops 
    WHERE status = 'pending' 
    AND matched_id IS NULL
    ORDER BY created_at ASC
  LOOP
    -- Find a matching drop with same amount
    SELECT * INTO matched_drop
    FROM public.drops 
    WHERE status = 'pending' 
    AND matched_id IS NULL
    AND amount = drop_record.amount
    AND id != drop_record.id
    AND sender_id != drop_record.sender_id
    ORDER BY RANDOM()
    LIMIT 1;
    
    -- If match found, update both drops
    IF FOUND THEN
      UPDATE public.drops 
      SET status = 'matched', 
          matched_id = matched_drop.id,
          updated_at = now()
      WHERE id = drop_record.id;
      
      UPDATE public.drops 
      SET status = 'matched', 
          matched_id = drop_record.id,
          updated_at = now()
      WHERE id = matched_drop.id;
      
      matched_count := matched_count + 1;
    END IF;
  END LOOP;
  
  RETURN matched_count;
END;
$$ LANGUAGE plpgsql;

-- Function to calculate 2% fee
CREATE OR REPLACE FUNCTION public.calculate_fee(amount INTEGER)
RETURNS INTEGER AS $$
BEGIN
  RETURN CEIL(amount * 0.02);
END;
$$ LANGUAGE plpgsql;

-- Function to process payment completion
CREATE OR REPLACE FUNCTION public.process_payment_completion(
  p_drop_id UUID,
  p_razorpay_payment_id TEXT,
  p_status TEXT
)
RETURNS VOID AS $$
DECLARE
  drop_record RECORD;
  fee_amount INTEGER;
BEGIN
  -- Get drop details
  SELECT * INTO drop_record FROM public.drops WHERE id = p_drop_id;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Drop not found';
  END IF;
  
  -- Calculate fee
  fee_amount := public.calculate_fee(drop_record.amount);
  
  -- Update drop status
  UPDATE public.drops 
  SET status = p_status,
      payment_id = p_razorpay_payment_id,
      updated_at = now()
  WHERE id = p_drop_id;
  
  -- Create transaction record
  INSERT INTO public.transactions (
    user_id, drop_id, type, amount, fee_amount, net_amount, 
    status, razorpay_payment_id, description
  ) VALUES (
    drop_record.sender_id, p_drop_id, 'drop_sent', 
    drop_record.amount, fee_amount, drop_record.amount - fee_amount,
    p_status, p_razorpay_payment_id, 
    'Karma drop payment'
  );
  
  -- If payment successful, update receiver's wallet
  IF p_status = 'completed' THEN
    -- Update receiver's wallet
    INSERT INTO public.wallets (user_id, pending_balance, total_earned)
    VALUES (drop_record.receiver_id, drop_record.amount, drop_record.amount)
    ON CONFLICT (user_id)
    DO UPDATE SET 
      pending_balance = wallets.pending_balance + EXCLUDED.pending_balance,
      total_earned = wallets.total_earned + EXCLUDED.total_earned,
      updated_at = now();
      
    -- Create transaction for receiver
    INSERT INTO public.transactions (
      user_id, drop_id, type, amount, fee_amount, net_amount, 
      status, description
    ) VALUES (
      drop_record.receiver_id, p_drop_id, 'drop_received', 
      drop_record.amount, 0, drop_record.amount,
      'completed', 'Karma drop received'
    );
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Trigger to check badges when drops are completed
CREATE OR REPLACE FUNCTION public.check_badges_on_drop_completion()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'completed' AND OLD.status != 'completed' THEN
    PERFORM public.check_and_award_badges(NEW.sender_id);
    PERFORM public.check_and_award_badges(NEW.receiver_id);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER check_badges_on_drop_completion
  AFTER UPDATE ON public.drops
  FOR EACH ROW
  EXECUTE FUNCTION public.check_badges_on_drop_completion(); 