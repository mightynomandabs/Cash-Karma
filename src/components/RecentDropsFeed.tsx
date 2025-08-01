import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import { Heart, Laugh, Flame, Share2, Clock, CheckCircle, Target, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

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
  const [error, setError] = useState<string | null>(null);
  const [userDrop, setUserDrop] = useState<Drop | null>(null);
  const [showTimeline, setShowTimeline] = useState(false);

  const reactionEmojis = [
    { emoji: '❤️', label: 'love' },
    { emoji: '😂', label: 'laugh' },
    { emoji: '🔥', label: 'fire' }
  ];

  // Mock data for demonstration
  const mockDropsData: Drop[] = [
    {
      id: '1',
      sender_id: 'user_1',
      amount: 50,
      message: "Spread some cheer! ✨",
      status: 'paid',
      created_at: new Date(Date.now() - 1000 * 60 * 5).toISOString(), // 5 minutes ago
      sender: {
        display_name: 'Sarah K.',
        avatar_url: 'https://picsum.photos/100/100?random=1'
      },
      reactions: [
        { emoji: '❤️', count: 12, user_reacted: false },
        { emoji: '😂', count: 3, user_reacted: false },
        { emoji: '🔥', count: 8, user_reacted: false }
      ]
    },
    {
      id: '2',
      sender_id: 'user_2',
      amount: 100,
      message: "Because kindness rocks! 🌟",
      status: 'paid',
      created_at: new Date(Date.now() - 1000 * 60 * 15).toISOString(), // 15 minutes ago
      sender: {
        display_name: 'Mike R.',
        avatar_url: 'https://picsum.photos/100/100?random=2'
      },
      reactions: [
        { emoji: '❤️', count: 24, user_reacted: true },
        { emoji: '😂', count: 7, user_reacted: false },
        { emoji: '🔥', count: 15, user_reacted: false }
      ]
    },
    {
      id: '3',
      sender_id: 'user_3',
      amount: 25,
      message: "Making someone's day! ☀️",
      status: 'matching',
      created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
      sender: {
        display_name: 'Emma L.',
        avatar_url: 'https://picsum.photos/100/100?random=3'
      },
      reactions: [
        { emoji: '❤️', count: 8, user_reacted: false },
        { emoji: '😂', count: 2, user_reacted: false },
        { emoji: '🔥', count: 5, user_reacted: false }
      ]
    },
    {
      id: '4',
      sender_id: 'user_4',
      amount: 75,
      message: "Random acts of awesome! 🎉",
      status: 'paid',
      created_at: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 minutes ago
      sender: {
        display_name: 'Alex T.',
        avatar_url: 'https://picsum.photos/100/100?random=4'
      },
      reactions: [
        { emoji: '❤️', count: 18, user_reacted: false },
        { emoji: '😂', count: 4, user_reacted: false },
        { emoji: '🔥', count: 11, user_reacted: false }
      ]
    },
    {
      id: '5',
      sender_id: 'user_5',
      amount: 200,
      message: "Big karma energy! 💜",
      status: 'paid',
      created_at: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1 hour ago
      sender: {
        display_name: 'David M.',
        avatar_url: 'https://picsum.photos/100/100?random=5'
      },
      reactions: [
        { emoji: '❤️', count: 35, user_reacted: true },
        { emoji: '😂', count: 9, user_reacted: false },
        { emoji: '🔥', count: 22, user_reacted: false }
      ]
    }
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

  const loadDrops = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Randomly succeed 95% of the time for demo
      if (Math.random() > 0.05) {
        setDrops(mockDropsData);
        
        // Find current user's most recent drop for tracking
        if (user) {
          const userLatestDrop = mockDropsData.find((drop: Drop) => drop.sender_id === user.id);
          setUserDrop(userLatestDrop || null);
        }
      } else {
        throw new Error('Network error');
      }
      
    } catch (err) {
      console.error('Error loading drops:', err);
      setError('Failed to load recent drops');
      // Still show mock data even on "error" for demo
      setDrops(mockDropsData);
      
      if (user) {
        const userLatestDrop = mockDropsData.find((drop: Drop) => drop.sender_id === user.id);
        setUserDrop(userLatestDrop || null);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReaction = async (dropId: string, emoji: string) => {
    if (!user) return;

    try {
      // Update local state for immediate feedback
      setDrops(prevDrops => 
        prevDrops.map(drop => {
          if (drop.id === dropId) {
            const reactions = drop.reactions || [];
            const existingReaction = reactions.find(r => r.emoji === emoji);
            
            if (existingReaction) {
              // Toggle reaction
              return {
                ...drop,
                reactions: reactions.map(r => 
                  r.emoji === emoji 
                    ? { ...r, count: r.user_reacted ? r.count - 1 : r.count + 1, user_reacted: !r.user_reacted }
                    : r
                )
              };
            } else {
              // Add new reaction
              return {
                ...drop,
                reactions: [...reactions, { emoji, count: 1, user_reacted: true }]
              };
            }
          }
          return drop;
        })
      );
      
      toast.success('Reaction updated!');
    } catch (error) {
      console.error('Error handling reaction:', error);
      toast.error('Failed to update reaction');
    }
  };

  const retryLoad = () => {
    loadDrops();
  };

  useEffect(() => {
    loadDrops();
  }, [refreshTrigger]);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center items-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <span className="ml-3 text-muted-foreground">Loading recent drops...</span>
        </div>
      </div>
    );
  }

  return (
    <div id="recent-drops" className="space-y-6">
      {/* Error Message */}
      {error && (
        <Card className="bg-yellow-50 border-l-4 border-yellow-400">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <p className="text-sm text-yellow-700">
                ⚠️ {error}. Showing demo data.
              </p>
              <Button 
                onClick={retryLoad}
                variant="outline" 
                size="sm"
                className="bg-yellow-500 hover:bg-yellow-600 text-white"
              >
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

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

          {/* Simple Timeline */}
          {showTimeline && (
            <Card className="bg-card/20 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Drop Created</p>
                      <p className="text-sm text-muted-foreground">{formatTimeAgo(userDrop.created_at)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <Target className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Finding Recipient</p>
                      <p className="text-sm text-muted-foreground">Matching with karma seekers</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <p className="font-medium">Payment Complete</p>
                      <p className="text-sm text-muted-foreground">Karma delivered successfully</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
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