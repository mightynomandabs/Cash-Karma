import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Heart, 
  Laugh, 
  Smile, 
  Flame, 
  Plus, 
  Send, 
  Sparkles,
  Shield,
  Eye,
  EyeOff
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface SocialStory {
  id: string;
  title: string;
  content: string;
  is_anonymous: boolean;
  is_approved: boolean;
  is_featured: boolean;
  created_at: string;
  user?: {
    display_name: string;
    avatar_url?: string;
  };
  reactions?: {
    heart: number;
    laugh: number;
    smile: number;
    fire: number;
    user_reacted?: {
      heart: boolean;
      laugh: boolean;
      smile: boolean;
      fire: boolean;
    };
  };
}

const GoodVibesBoard = () => {
  const { user } = useAuth();
  const [stories, setStories] = useState<SocialStory[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showSubmitForm, setShowSubmitForm] = useState(false);
  const [newStory, setNewStory] = useState({
    title: '',
    content: '',
    is_anonymous: false
  });

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('social_stories')
        .select(`
          *,
          profiles!social_stories_user_id_fkey(display_name, avatar_url)
        `)
        .eq('is_approved', true)
        .order('is_featured', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(20);

      if (error) throw error;

      // Fetch reactions for each story
      const storiesWithReactions = await Promise.all(
        (data || []).map(async (story: any) => {
          const { data: reactions } = await supabase
            .from('story_reactions')
            .select('reaction_type, user_id')
            .eq('story_id', story.id);

          // Count reactions by type
          const reactionCounts = {
            heart: reactions?.filter((r: any) => r.reaction_type === 'heart').length || 0,
            laugh: reactions?.filter((r: any) => r.reaction_type === 'laugh').length || 0,
            smile: reactions?.filter((r: any) => r.reaction_type === 'smile').length || 0,
            fire: reactions?.filter((r: any) => r.reaction_type === 'fire').length || 0,
            user_reacted: {
              heart: reactions?.some((r: any) => r.reaction_type === 'heart' && r.user_id === user?.id) || false,
              laugh: reactions?.some((r: any) => r.reaction_type === 'laugh' && r.user_id === user?.id) || false,
              smile: reactions?.some((r: any) => r.reaction_type === 'smile' && r.user_id === user?.id) || false,
              fire: reactions?.some((r: any) => r.reaction_type === 'fire' && r.user_id === user?.id) || false,
            }
          };

          return {
            ...story,
            user: story.profiles,
            reactions: reactionCounts
          };
        })
      );

      setStories(storiesWithReactions);
    } catch (error) {
      console.error('Error fetching stories:', error);
      toast.error('Failed to load stories');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitStory = async () => {
    if (!user || !newStory.title.trim() || !newStory.content.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      
      const { error } = await supabase
        .from('social_stories')
        .insert({
          user_id: user.id,
          title: newStory.title.trim(),
          content: newStory.content.trim(),
          is_anonymous: newStory.is_anonymous,
          is_approved: false // Pre-moderated
        });

      if (error) throw error;

      toast.success('Story submitted!', {
        description: 'Your story will be reviewed and approved soon.',
        duration: 4000,
      });

      // Reset form
      setNewStory({ title: '', content: '', is_anonymous: false });
      setShowSubmitForm(false);
      
      // Refresh stories
      fetchStories();
    } catch (error) {
      console.error('Error submitting story:', error);
      toast.error('Failed to submit story');
    } finally {
      setSubmitting(false);
    }
  };

  const handleReaction = async (storyId: string, reactionType: string) => {
    if (!user) {
      toast.error('Please log in to react');
      return;
    }

    try {
      const existingReaction = stories.find(s => s.id === storyId)?.reactions?.user_reacted?.[reactionType as keyof typeof stories[0]['reactions']['user_reacted']];

      if (existingReaction) {
        // Remove reaction
        const { error } = await supabase
          .from('story_reactions')
          .delete()
          .eq('story_id', storyId)
          .eq('user_id', user.id)
          .eq('reaction_type', reactionType);

        if (error) throw error;
      } else {
        // Add reaction
        const { error } = await supabase
          .from('story_reactions')
          .insert({
            story_id: storyId,
            user_id: user.id,
            reaction_type: reactionType
          });

        if (error) throw error;
      }

      // Update local state
      setStories(prev => prev.map(story => {
        if (story.id === storyId) {
          const currentReactions = story.reactions || { heart: 0, laugh: 0, smile: 0, fire: 0, user_reacted: { heart: false, laugh: false, smile: false, fire: false } };
          
          if (existingReaction) {
            // Remove reaction
            return {
              ...story,
              reactions: {
                ...currentReactions,
                [reactionType]: Math.max(0, (currentReactions[reactionType as keyof typeof currentReactions] as number) - 1),
                user_reacted: {
                  ...currentReactions.user_reacted,
                  [reactionType]: false
                }
              }
            };
          } else {
            // Add reaction
            return {
              ...story,
              reactions: {
                ...currentReactions,
                [reactionType]: (currentReactions[reactionType as keyof typeof currentReactions] as number) + 1,
                user_reacted: {
                  ...currentReactions.user_reacted,
                  [reactionType]: true
                }
              }
            };
          }
        }
        return story;
      }));

      // Show burst animation
      toast.success(`${reactionType === 'heart' ? '❤️' : reactionType === 'laugh' ? '😂' : reactionType === 'smile' ? '😊' : '🔥'}`, {
        duration: 1000,
      });
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to react');
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const date = new Date(dateString);
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    
    if (diffInDays === 0) return 'Today';
    if (diffInDays === 1) return 'Yesterday';
    if (diffInDays < 7) return `${diffInDays} days ago`;
    if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
    return `${Math.floor(diffInDays / 30)} months ago`;
  };

  const getReactionIcon = (type: string) => {
    switch (type) {
      case 'heart':
        return <Heart className="w-4 h-4" />;
      case 'laugh':
        return <Laugh className="w-4 h-4" />;
      case 'smile':
        return <Smile className="w-4 h-4" />;
      case 'fire':
        return <Flame className="w-4 h-4" />;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading good vibes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent">
          Good Vibes Board
        </h2>
        <p className="text-muted-foreground">
          Share your positive karma stories and spread good vibes
        </p>
        
        {user && (
          <Button
            onClick={() => setShowSubmitForm(!showSubmitForm)}
            className="flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Share Your Story
          </Button>
        )}
      </div>

      {/* Submit Form */}
      {showSubmitForm && user && (
        <Card className="bg-gradient-to-r from-brand-pink/10 to-brand-yellow/10 border-brand-pink/30">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="w-5 h-5" />
              Share Your Karma Story
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Story Title</Label>
              <Input
                id="title"
                placeholder="Give your story a catchy title..."
                value={newStory.title}
                onChange={(e) => setNewStory(prev => ({ ...prev, title: e.target.value }))}
                maxLength={100}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="content">Your Story</Label>
              <Textarea
                id="content"
                placeholder="Share your positive karma experience..."
                value={newStory.content}
                onChange={(e) => setNewStory(prev => ({ ...prev, content: e.target.value }))}
                rows={4}
                maxLength={500}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="anonymous"
                checked={newStory.is_anonymous}
                onChange={(e) => setNewStory(prev => ({ ...prev, is_anonymous: e.target.checked }))}
                className="rounded"
              />
              <Label htmlFor="anonymous" className="text-sm">
                Share anonymously
              </Label>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitStory}
                disabled={submitting || !newStory.title.trim() || !newStory.content.trim()}
                className="flex-1"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Submitting...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4 mr-2" />
                    Submit Story
                  </>
                )}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => setShowSubmitForm(false)}
                disabled={submitting}
              >
                Cancel
              </Button>
            </div>
            
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Shield className="w-3 h-3" />
              <span>All stories are pre-moderated for quality and safety</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stories Feed */}
      <div className="space-y-4">
        {stories.length === 0 ? (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-gradient-to-r from-brand-pink to-brand-yellow rounded-full flex items-center justify-center mx-auto">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">No stories yet</h3>
                  <p className="text-muted-foreground text-sm">
                    Be the first to share your karma story and spread good vibes!
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          stories.map((story) => (
            <Card key={story.id} className={`relative overflow-hidden ${
              story.is_featured ? 'bg-gradient-to-r from-brand-pink/10 to-brand-yellow/10 border-brand-pink/30' : ''
            }`}>
              {story.is_featured && (
                <div className="absolute top-2 right-2">
                  <Badge variant="secondary" className="bg-brand-pink/20 text-brand-pink border-brand-pink/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Featured
                  </Badge>
                </div>
              )}
              
              <CardHeader className="pb-3">
                <div className="flex items-start gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={story.is_anonymous ? undefined : story.user?.avatar_url} />
                    <AvatarFallback className="text-xs">
                      {story.is_anonymous ? '?' : story.user?.display_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">
                        {story.title}
                      </h3>
                      {story.is_anonymous && (
                        <Badge variant="outline" className="text-xs">
                          <EyeOff className="w-3 h-3 mr-1" />
                          Anonymous
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>
                        {story.is_anonymous ? 'Anonymous Karma Giver' : story.user?.display_name || 'Unknown'}
                      </span>
                      <span>•</span>
                      <span>{formatTimeAgo(story.created_at)}</span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                <p className="text-muted-foreground leading-relaxed">
                  {story.content}
                </p>
                
                {/* Reactions */}
                <div className="flex items-center gap-2 pt-2 border-t border-border/20">
                  {(['heart', 'laugh', 'smile', 'fire'] as const).map((reactionType) => (
                    <Button
                      key={reactionType}
                      variant={story.reactions?.user_reacted?.[reactionType] ? 'default' : 'ghost'}
                      size="sm"
                      onClick={() => handleReaction(story.id, reactionType)}
                      className={`flex items-center gap-1 h-8 px-2 ${
                        story.reactions?.user_reacted?.[reactionType] 
                          ? 'bg-brand-pink/20 text-brand-pink border-brand-pink/30' 
                          : 'hover:bg-muted'
                      }`}
                    >
                      {getReactionIcon(reactionType)}
                      <span className="text-xs">
                        {story.reactions?.[reactionType] || 0}
                      </span>
                    </Button>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Community Guidelines */}
      <Card className="bg-gradient-to-r from-brand-navy/20 to-brand-navy/10 border-brand-pink/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-12 h-12 bg-gradient-to-r from-brand-green to-brand-yellow rounded-full flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-2">Community Guidelines</h3>
              <p className="text-muted-foreground text-sm">
                Share positive, uplifting stories. Be kind, be genuine, be anonymous if you prefer. 
                All stories are pre-moderated to maintain our good vibes community.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default GoodVibesBoard; 