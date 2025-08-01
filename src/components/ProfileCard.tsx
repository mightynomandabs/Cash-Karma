import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { 
  Edit, 
  Save, 
  X, 
  Sparkles, 
  Trophy, 
  Star, 
  Heart, 
  Zap,
  Crown,
  Target,
  Gift,
  Flame
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Profile {
  id: string;
  user_id: string;
  display_name: string;
  avatar_url: string;
  karma_points: number;
  total_given: number;
  total_received: number;
  level: number;
  created_at: string;
  updated_at: string;
}

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  unlocked: boolean;
  unlocked_at?: string;
}

const ProfileCard = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showBadges, setShowBadges] = useState(false);

  // Level titles
  const levelTitles = [
    "Karma Newbie",
    "Kindness Seeker", 
    "Generosity Sprout",
    "Karma Champ",
    "Compassion Master",
    "Good Vibes Legend",
    "Karma Sage",
    "Kindness King",
    "Generosity Guru",
    "Karma God"
  ];

  // XP requirements per level
  const xpPerLevel = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];

  // Badges system
  const badges: Badge[] = [
    {
      id: 'first-drop',
      name: 'First Drop',
      description: 'Sent your first karma drop',
      icon: Gift,
      color: 'bg-brand-green',
      unlocked: profile?.total_given ? profile.total_given > 0 : false
    },
    {
      id: 'streak-3',
      name: '3-Day Streak',
      description: 'Sent drops for 3 consecutive days',
      icon: Flame,
      color: 'bg-brand-yellow',
      unlocked: false // Would need streak tracking
    },
    {
      id: 'generous',
      name: 'Generous Soul',
      description: 'Sent 10 karma drops',
      icon: Heart,
      color: 'bg-brand-pink',
      unlocked: profile?.total_given ? profile.total_given >= 10 : false
    },
    {
      id: 'level-5',
      name: 'Level 5 Achiever',
      description: 'Reached level 5',
      icon: Star,
      color: 'bg-primary',
      unlocked: profile?.level ? profile.level >= 5 : false
    },
    {
      id: 'karma-master',
      name: 'Karma Master',
      description: 'Sent 50 karma drops',
      icon: Crown,
      color: 'bg-gradient-to-r from-brand-yellow to-brand-pink',
      unlocked: profile?.total_given ? profile.total_given >= 50 : false
    },
    {
      id: 'target-hit',
      name: 'Target Hit',
      description: 'Sent a drop of ₹100 or more',
      icon: Target,
      color: 'bg-accent',
      unlocked: false // Would need to track individual drop amounts
    }
  ];

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;

      setProfile(data);
      setDisplayName(data.display_name || '');
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const updateDisplayName = async () => {
    if (!user || !displayName.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ display_name: displayName.trim() })
        .eq('user_id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: displayName.trim() } : null);
      setIsEditing(false);
      toast.success('Display name updated!');
    } catch (error) {
      console.error('Error updating display name:', error);
      toast.error('Failed to update display name');
    } finally {
      setLoading(false);
    }
  };

  const getCurrentLevelProgress = () => {
    if (!profile) return { currentLevel: 1, progress: 0, xpToNext: 100 };
    
    const currentLevel = profile.level || 1;
    const currentXP = profile.karma_points || 0;
    const xpForCurrentLevel = xpPerLevel[currentLevel - 1] || 0;
    const xpForNextLevel = xpPerLevel[currentLevel] || xpPerLevel[currentLevel - 1] + 100;
    const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;
    
    return {
      currentLevel,
      progress: Math.min(progress, 100),
      xpToNext: xpForNextLevel - currentXP
    };
  };

  const getLevelTitle = (level: number) => {
    return levelTitles[Math.min(level - 1, levelTitles.length - 1)];
  };

  useEffect(() => {
    fetchProfile();
  }, [user]);

  if (!profile) {
    return (
      <Card className="bg-card/20 backdrop-blur-sm animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-muted/20 rounded" />
        </CardContent>
      </Card>
    );
  }

  const { currentLevel, progress, xpToNext } = getCurrentLevelProgress();
  const unlockedBadges = badges.filter(badge => badge.unlocked);

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="bg-card/20 backdrop-blur-sm border border-primary/30 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-6">
            {/* Avatar */}
            <div className="relative">
              <Avatar className="w-20 h-20 ring-4 ring-primary/20">
                <AvatarImage src={profile.avatar_url} />
                <AvatarFallback>
                  {profile.display_name?.charAt(0) || '?'}
                </AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                <Sparkles className="w-3 h-3 text-white" />
              </div>
            </div>

            {/* Profile Info */}
            <div className="flex-1 space-y-4">
              {/* Display Name */}
              <div className="flex items-center gap-3">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <Input
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="h-8 text-lg font-bold"
                      maxLength={20}
                    />
                    <Button
                      size="sm"
                      onClick={updateDisplayName}
                      disabled={loading}
                      className="h-8 px-3"
                    >
                      <Save className="w-3 h-3" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        setIsEditing(false);
                        setDisplayName(profile.display_name || '');
                      }}
                      className="h-8 px-3"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold">{profile.display_name}</h2>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsEditing(true)}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>

              {/* Level Display */}
              <div>
                <h3 className="text-lg font-semibold text-primary">
                  Level {currentLevel}: {getLevelTitle(currentLevel)}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {profile.karma_points || 0} XP • {xpToNext} XP to next level
                </p>
              </div>

              {/* Karma Meter */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Karma Progress</span>
                  <span>{Math.round(progress)}%</span>
                </div>
                <div className="relative">
                  <div className="w-full h-3 bg-muted/30 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-primary to-brand-pink rounded-full transition-all duration-500 relative"
                      style={{ width: `${progress}%` }}
                    >
                      {/* Sparkle animation */}
                      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
                    </div>
                  </div>
                  {/* Neon glow effect */}
                  <div className="absolute inset-0 rounded-full shadow-[0_0_10px_rgba(34,197,94,0.5)] pointer-events-none" />
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-primary">{profile.total_given || 0}</div>
                  <div className="text-xs text-muted-foreground">Drops Sent</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-accent">{profile.total_received || 0}</div>
                  <div className="text-xs text-muted-foreground">Drops Received</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-brand-yellow">{unlockedBadges.length}</div>
                  <div className="text-xs text-muted-foreground">Badges</div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Badges Showcase */}
      <Card className="bg-card/20 backdrop-blur-sm border border-accent/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Badges</h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowBadges(!showBadges)}
            >
              {showBadges ? 'Show Less' : 'Show All'}
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {badges.slice(0, showBadges ? badges.length : 6).map((badge) => {
              const Icon = badge.icon;
              return (
                <div
                  key={badge.id}
                  className={`relative p-3 rounded-lg border transition-all duration-300 ${
                    badge.unlocked
                      ? 'bg-card/50 border-accent/30 hover:border-accent/50'
                      : 'bg-muted/20 border-border/30 opacity-50'
                  }`}
                >
                  <div className="text-center space-y-2">
                    <div className={`w-8 h-8 mx-auto rounded-full flex items-center justify-center ${
                      badge.unlocked ? badge.color : 'bg-muted'
                    }`}>
                      <Icon className={`w-4 h-4 ${
                        badge.unlocked ? 'text-white' : 'text-muted-foreground'
                      }`} />
                    </div>
                    <div>
                      <p className={`text-xs font-medium ${
                        badge.unlocked ? 'text-foreground' : 'text-muted-foreground'
                      }`}>
                        {badge.name}
                      </p>
                      {showBadges && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {badge.description}
                        </p>
                      )}
                    </div>
                  </div>
                  {badge.unlocked && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary rounded-full animate-pulse" />
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileCard; 