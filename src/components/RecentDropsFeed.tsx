import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, Laugh, Flame, Share2, Clock, CheckCircle, Target, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import DropStatusTimeline from "./DropStatusTimeline";

interface Drop {
  id: string;
  sender_id: string;
  amount: number;
  message: string;
  status: string;
  created_at: string;
  sender?: {
    display_name: string;
    avatar_url?: string;
  };
  reactions?: Array<{
    emoji: string;
    count: number;
    user_reacted: boolean;
  }>;
}

interface RecentDropsFeedProps {
  refreshTrigger: number;
}

const RecentDropsFeed = ({ refreshTrigger }: RecentDropsFeedProps) => {
  const { user } = useAuth();
  const [drops, setDrops] = useState<Drop[]>([]);
  const [loading, setLoading] = useState(true);
  const [userDrop, setUserDrop] = useState<Drop | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const reactionEmojis = [
    { emoji: '❤️', label: 'love' },
    { emoji: '😂', label: 'laugh' },
    { emoji: '🔥', label: 'fire' }
  ];

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  const fetchDrops = async () => {
    try {
      // Fetch drops with sender info
      const { data: dropsData, error: dropsError } = await supabase
        .from('drops')
        .select(`
          *,
          profiles!drops_sender_id_fkey(display_name, avatar_url)
        `)
        .order('created_at', { ascending: false })
        .limit(20);

      if (dropsError) throw dropsError;

      // Fetch reactions for each drop
      const dropsWithReactions = await Promise.all(
        dropsData.map(async (drop: any) => {
          const { data: reactions } = await supabase
            .from('reactions')
            .select('emoji, user_id')
            .eq('drop_id', drop.id);

          // Group reactions by emoji and check if current user reacted
          const reactionCounts = reactionEmojis.map(({ emoji }) => {
            const emojiReactions = reactions?.filter((r: any) => r.emoji === emoji) || [];
            return {
              emoji,
              count: emojiReactions.length,
              user_reacted: emojiReactions.some((r: any) => r.user_id === user?.id)
            };
          });

          return {
            ...drop,
            sender: drop.profiles,
            reactions: reactionCounts
          };
        })
      );

      setDrops(dropsWithReactions);
      
      // Find current user's most recent drop for tracking
      if (user) {
        const userLatestDrop = dropsWithReactions.find((drop: Drop) => drop.sender_id === user.id);
        setUserDrop(userLatestDrop || null);
      }
    } catch (error) {
      console.error('Error fetching drops:', error);
      toast.error('Failed to load recent drops');
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (dropId: string, emoji: string) => {
    if (!user) return;

    try {
      // Check if user already reacted with this emoji
      const { data: existingReaction } = await supabase
        .from('reactions')
        .select('id')
        .eq('drop_id', dropId)
        .eq('user_id', user.id)
        .eq('emoji', emoji)
        .single();

      if (existingReaction) {
        // Remove reaction
        await supabase
          .from('reactions')
          .delete()
          .eq('id', existingReaction.id);
      } else {
        // Add reaction
        await supabase
          .from('reactions')
          .insert({
            drop_id: dropId,
            user_id: user.id,
            emoji
          });
      }

      // Refresh drops to show updated reactions
      fetchDrops();
    } catch (error) {
      console.error('Error handling reaction:', error);
    }
  };

  useEffect(() => {
    fetchDrops();
  }, [refreshTrigger]);

  useEffect(() => {
    // Subscribe to real-time updates
    const channel = supabase
      .channel('drops-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'drops' }, () => {
        fetchDrops();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, () => {
        fetchDrops();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="bg-card/20 backdrop-blur-sm animate-pulse">
            <CardContent className="p-6">
              <div className="h-20 bg-muted/20 rounded" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div id="recent-drops" className="space-y-6">
      {/* Track My Drop */}
      {userDrop && (
        <div className="space-y-4">
          <Card className="bg-card/20 backdrop-blur-sm border-primary/20 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Track My Drop</h3>
                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => setShowTimeline(!showTimeline)}
                  >
                    {showTimeline ? 'Hide Timeline' : 'View Timeline'}
                  </Button>
                  <Button variant="ghost" size="sm">
                    <Share2 className="w-4 h-4 mr-2" />
                    Share Story
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span>₹{userDrop.amount} • {userDrop.message}</span>
                  <span className="text-muted-foreground">
                    {formatTimeAgo(userDrop.created_at)}
                  </span>
                </div>
                
                <Progress value={getStatusProgress(userDrop.status)} className="h-2" />
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getStatusIcon('pending')}
                      <span>Sent</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getStatusIcon('matching')}
                      <span>Matching</span>
                    </div>
                    <div className="flex items-center gap-1 text-muted-foreground">
                      {getStatusIcon('paid')}
                      <span>Paid</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-primary">
                    {getStatusIcon(userDrop.status)}
                    <span className="capitalize">{userDrop.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Detailed Timeline */}
          {showTimeline && (
            <DropStatusTimeline drop={userDrop} />
          )}
        </div>
      )}

      {/* Pending Drop Message */}
      {userDrop && userDrop.status === 'pending' && (
        <Card className="bg-gradient-to-r from-brand-yellow/20 to-brand-pink/20 border-brand-yellow/30">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0 w-8 h-8 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-brand-yellow" />
              </div>
              <div>
                <p className="text-sm font-medium">
                  Hang tight... your drop is joining the Karma pool!
                </p>
                <p className="text-xs text-muted-foreground">
                  We're finding the perfect recipient for your kindness
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recent Drops Feed */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Live Drop Feed</h3>
        
        {drops.length === 0 ? (
          <Card className="bg-card/20 backdrop-blur-sm">
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">No drops yet. Be the first to spread some karma! ✨</p>
            </CardContent>
          </Card>
        ) : (
          drops.map((drop) => (
            <Card 
              key={drop.id} 
              className="bg-card/20 backdrop-blur-sm border-border/30 hover:border-primary/20 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <CardContent className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="w-12 h-12 ring-2 ring-primary/20">
                    <AvatarImage src={drop.sender?.avatar_url} />
                    <AvatarFallback>
                      {drop.sender?.display_name?.charAt(0) || '?'}
                    </AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold">
                          {drop.sender?.display_name || 'Anonymous'}
                        </span>
                        <span className="text-primary font-bold ml-2">
                          ₹{drop.amount}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatTimeAgo(drop.created_at)}
                      </span>
                    </div>
                    
                    <p className="text-foreground/90">{drop.message}</p>
                    
                    <div className="flex items-center gap-4">
                      {reactionEmojis.map(({ emoji, label }) => {
                        const reaction = drop.reactions?.find(r => r.emoji === emoji);
                        const isActive = reaction?.user_reacted;
                        const count = reaction?.count || 0;
                        
                        return (
                          <Button
                            key={emoji}
                            variant="ghost"
                            size="sm"
                            onClick={() => handleReaction(drop.id, emoji)}
                            className={`
                              flex items-center gap-1 transition-all duration-200
                              ${isActive ? 'bg-primary/20 text-primary' : 'text-muted-foreground hover:text-foreground'}
                            `}
                          >
                            <span className="text-base">{emoji}</span>
                            {count > 0 && <span className="text-xs">{count}</span>}
                          </Button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

const getStatusProgress = (status: string) => {
  switch (status) {
    case 'pending': return 25;
    case 'matching': return 50;
    case 'paid': return 100;
    default: return 0;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending': return <Clock className="w-4 h-4" />;
    case 'matching': return <Target className="w-4 h-4" />;
    case 'paid': return <CheckCircle className="w-4 h-4" />;
    default: return <Clock className="w-4 h-4" />;
  }
};

export default RecentDropsFeed;