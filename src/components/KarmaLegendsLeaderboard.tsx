import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trophy, Medal, Star, TrendingUp, Users, Target } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LeaderboardEntry {
  id: string;
  user_id: string;
  period_type: string;
  category: string;
  score: number;
  rank: number | null;
  period_start: string;
  period_end: string;
  user?: {
    display_name: string;
    avatar_url?: string;
    karma_points: number;
    level: number;
  };
}

interface UserRank {
  rank: number | null;
  score: number;
  category: string;
  period_type: string;
}

const KarmaLegendsLeaderboard = () => {
  const { user } = useAuth();
  const [leaderboardData, setLeaderboardData] = useState<{
    droppers: LeaderboardEntry[];
    receivers: LeaderboardEntry[];
    streakMasters: LeaderboardEntry[];
  }>({
    droppers: [],
    receivers: [],
    streakMasters: []
  });
  const [userRanks, setUserRanks] = useState<UserRank[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState<'weekly' | 'all_time'>('weekly');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboardData();
  }, [selectedPeriod]);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch top 10 for each category
      const categories = ['droppers', 'receivers', 'streak_masters'];
      const leaderboardData: any = {};

      for (const category of categories) {
        const { data, error } = await supabase
          .from('leaderboard_entries')
          .select(`
            *,
            profiles!leaderboard_entries_user_id_fkey(
              display_name,
              avatar_url,
              karma_points,
              level
            )
          `)
          .eq('period_type', selectedPeriod)
          .eq('category', category)
          .order('score', { ascending: false })
          .limit(10);

        if (error) throw error;
        leaderboardData[category] = data || [];
      }

      setLeaderboardData(leaderboardData);

      // Fetch user's own ranks if logged in
      if (user) {
        const userRanksData = await Promise.all(
          categories.map(async (category) => {
            const { data: rankData } = await supabase
              .rpc('get_user_rank', {
                p_user_id: user.id,
                p_period_type: selectedPeriod,
                p_category: category
              });

            const { data: scoreData } = await supabase
              .from('leaderboard_entries')
              .select('score')
              .eq('user_id', user.id)
              .eq('period_type', selectedPeriod)
              .eq('category', category)
              .single();

            return {
              rank: rankData,
              score: scoreData?.score || 0,
              category,
              period_type: selectedPeriod
            };
          })
        );

        setUserRanks(userRanksData);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      toast.error('Failed to load leaderboard data');
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Trophy className="w-5 h-5 text-brand-yellow" />;
      case 2:
        return <Medal className="w-5 h-5 text-brand-pink" />;
      case 3:
        return <Star className="w-5 h-5 text-brand-green" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBorderClass = (rank: number) => {
    switch (rank) {
      case 1:
        return "border-brand-yellow/50 shadow-brand-yellow/20 animate-pulse";
      case 2:
        return "border-brand-pink/50 shadow-brand-pink/20";
      case 3:
        return "border-brand-green/50 shadow-brand-green/20";
      default:
        return "border-border/30";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'droppers':
        return <TrendingUp className="w-4 h-4" />;
      case 'receivers':
        return <Users className="w-4 h-4" />;
      case 'streak_masters':
        return <Target className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getCategoryTitle = (category: string) => {
    switch (category) {
      case 'droppers':
        return 'Top Droppers';
      case 'receivers':
        return 'Top Receivers';
      case 'streak_masters':
        return 'Streak Masters';
      default:
        return category;
    }
  };

  const getScoreLabel = (category: string, score: number) => {
    switch (category) {
      case 'droppers':
        return `${score} drops`;
      case 'receivers':
        return `${score} received`;
      case 'streak_masters':
        return `${score} day streak`;
      default:
        return score.toString();
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="text-muted-foreground mt-2">Loading legends...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent">
          Karma Legends
        </h2>
        <p className="text-muted-foreground">
          The most generous souls in the Cash Karma universe
        </p>
        
        {/* Period Toggle */}
        <div className="flex justify-center gap-2">
          <Button
            variant={selectedPeriod === 'weekly' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('weekly')}
          >
            This Week
          </Button>
          <Button
            variant={selectedPeriod === 'all_time' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('all_time')}
          >
            All Time
          </Button>
        </div>
      </div>

      {/* User's Current Rank */}
      {user && userRanks.length > 0 && (
        <Card className="bg-gradient-to-r from-brand-navy/20 to-brand-navy/10 border-brand-pink/30">
          <CardHeader>
            <CardTitle className="text-lg">Your Rankings</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {userRanks.map((rank) => (
                <div key={rank.category} className="flex items-center justify-between p-3 bg-card/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    {getCategoryIcon(rank.category)}
                    <span className="text-sm font-medium capitalize">
                      {rank.category.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold">
                      {rank.rank ? `#${rank.rank}` : 'Unranked'}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {getScoreLabel(rank.category, rank.score)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Leaderboard Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {Object.entries(leaderboardData).map(([category, entries]) => (
          <Card key={category} className="relative overflow-hidden">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2 text-lg">
                {getCategoryIcon(category)}
                {getCategoryTitle(category)}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <p>No data yet</p>
                  <p className="text-sm">Be the first to make history!</p>
                </div>
              ) : (
                entries.map((entry, index) => (
                  <div
                    key={entry.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all hover:bg-muted/50 ${
                      getRankBorderClass(index + 1)
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {getRankIcon(index + 1)}
                    </div>
                    
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={entry.user?.avatar_url} />
                      <AvatarFallback className="text-xs">
                        {entry.user?.display_name?.charAt(0) || '?'}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-sm truncate">
                        {entry.user?.display_name || 'Anonymous'}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Level {entry.user?.level || 1} • {entry.user?.karma_points || 0} karma
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="font-bold text-sm">
                        {getScoreLabel(category, entry.score)}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Legendary Status */}
      <Card className="bg-gradient-to-r from-brand-pink/10 to-brand-yellow/10 border-brand-pink/30">
        <CardContent className="pt-6">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-brand-pink to-brand-yellow rounded-full flex items-center justify-center">
                <Trophy className="w-8 h-8 text-white" />
              </div>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2">Become a Legend</h3>
              <p className="text-muted-foreground text-sm">
                Keep dropping karma to climb the ranks and earn your place among the legends!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default KarmaLegendsLeaderboard; 