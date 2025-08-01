import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { 
  Target, 
  Flame, 
  Trophy, 
  Calendar,
  Sparkles,
  CheckCircle,
  Gift
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { GamificationService, XP_REWARDS } from "@/lib/gamification";
import { toast } from "sonner";

interface DailyGoal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  xpReward: number;
  completed: boolean;
  icon: React.ComponentType<any>;
}

const DailyGoals = () => {
  const { user } = useAuth();
  const [goals, setGoals] = useState<DailyGoal[]>([]);
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showConfetti, setShowConfetti] = useState(false);

  const dailyGoals: DailyGoal[] = [
    {
      id: 'daily-drop',
      title: 'Daily Drop',
      description: 'Send one karma drop today',
      target: 1,
      current: 0,
      xpReward: XP_REWARDS.DAILY_GOAL,
      completed: false,
      icon: Gift
    },
    {
      id: 'streak-maintain',
      title: 'Maintain Streak',
      description: 'Keep your daily drop streak going',
      target: 1,
      current: 0,
      xpReward: XP_REWARDS.STREAK_BONUS,
      completed: false,
      icon: Flame
    },
    {
      id: 'big-drop',
      title: 'Big Drop',
      description: 'Send a drop of ₹50 or more',
      target: 1,
      current: 0,
      xpReward: 25,
      completed: false,
      icon: Target
    }
  ];

  const fetchDailyStats = async () => {
    if (!user) return;

    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);

      // Get today's drops
      const { data: todayDrops, error: dropsError } = await supabase
        .from('drops')
        .select('amount, created_at')
        .eq('sender_id', user.id)
        .gte('created_at', today.toISOString())
        .lt('created_at', tomorrow.toISOString());

      if (dropsError) throw dropsError;

      // Calculate streak
      const { data: allDrops, error: allDropsError } = await supabase
        .from('drops')
        .select('created_at')
        .eq('sender_id', user.id)
        .order('created_at', { ascending: false })
        .limit(30);

      if (allDropsError) throw allDropsError;

      const currentStreak = GamificationService.calculateStreak(allDrops || []);
      setStreak(currentStreak);

      // Update goals
      const updatedGoals = dailyGoals.map(goal => {
        let current = 0;
        let completed = false;

        switch (goal.id) {
          case 'daily-drop':
            current = todayDrops?.length || 0;
            completed = current >= goal.target;
            break;
          case 'streak-maintain':
            current = currentStreak > 0 ? 1 : 0;
            completed = currentStreak > 0;
            break;
          case 'big-drop':
            current = todayDrops?.filter(drop => drop.amount >= 50).length || 0;
            completed = current >= goal.target;
            break;
        }

        return {
          ...goal,
          current,
          completed
        };
      });

      setGoals(updatedGoals);

      // Check for completed goals and award XP
      for (const goal of updatedGoals) {
        if (goal.completed) {
          await GamificationService.awardXP(user.id, goal.xpReward, `Daily Goal: ${goal.title}`);
        }
      }

      // Check for milestone celebrations
      if (currentStreak > 0 && currentStreak % 7 === 0) {
        await celebrateMilestone('week-streak', currentStreak);
      }

    } catch (error) {
      console.error('Error fetching daily stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const celebrateMilestone = async (type: string, value: number) => {
    setShowConfetti(true);
    
    // Create milestone notification
    await supabase
      .from('notifications')
      .insert({
        user_id: user!.id,
        type: 'milestone',
        title: `🎉 Milestone Reached!`,
        message: `Congratulations on your ${value}-day streak!`,
        read: false
      });

    // Award bonus XP
    await GamificationService.awardXP(user!.id, value * 5, `Milestone: ${value}-day streak`);

    toast.success(`🎉 ${value}-Day Streak!`, {
      description: `Amazing! You've been spreading karma for ${value} days straight!`,
      duration: 5000,
    });

    setTimeout(() => setShowConfetti(false), 3000);
  };

  useEffect(() => {
    fetchDailyStats();
  }, [user]);

  if (loading) {
    return (
      <Card className="bg-card/20 backdrop-blur-sm animate-pulse">
        <CardContent className="p-6">
          <div className="h-32 bg-muted/20 rounded" />
        </CardContent>
      </Card>
    );
  }

  const completedGoals = goals.filter(goal => goal.completed).length;
  const totalGoals = goals.length;

  return (
    <div className="space-y-6">
      {/* Daily Goals Card */}
      <Card className="bg-card/20 backdrop-blur-sm border border-brand-yellow/30 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-brand-yellow" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Daily Goals</h3>
                <p className="text-sm text-muted-foreground">
                  {completedGoals}/{totalGoals} completed
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-brand-yellow">{streak}</div>
              <div className="text-xs text-muted-foreground">Day Streak</div>
            </div>
          </div>

          {/* Goals Progress */}
          <div className="space-y-4">
            {goals.map((goal) => {
              const Icon = goal.icon;
              const progress = (goal.current / goal.target) * 100;

              return (
                <div key={goal.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        goal.completed ? 'bg-brand-green/20' : 'bg-muted/30'
                      }`}>
                        <Icon className={`w-4 h-4 ${
                          goal.completed ? 'text-brand-green' : 'text-muted-foreground'
                        }`} />
                      </div>
                      <div>
                        <h4 className={`font-medium ${
                          goal.completed ? 'text-foreground' : 'text-muted-foreground'
                        }`}>
                          {goal.title}
                        </h4>
                        <p className="text-xs text-muted-foreground">
                          {goal.description}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium">
                        {goal.current}/{goal.target}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        +{goal.xpReward} XP
                      </div>
                    </div>
                  </div>
                  
                  <div className="relative">
                    <Progress value={progress} className="h-2" />
                    {goal.completed && (
                      <div className="absolute -top-1 -right-1">
                        <CheckCircle className="w-4 h-4 text-brand-green" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Streak Bonus */}
          {streak > 0 && (
            <div className="mt-6 p-4 bg-gradient-to-r from-brand-yellow/20 to-brand-pink/20 rounded-lg border border-brand-yellow/30">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-brand-yellow/20 rounded-full flex items-center justify-center">
                  <Flame className="w-4 h-4 text-brand-yellow" />
                </div>
                <div>
                  <h4 className="font-medium">Streak Bonus</h4>
                  <p className="text-xs text-muted-foreground">
                    +{streak * 5} XP for your {streak}-day streak!
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Confetti Animation */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {[...Array(20)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                animationDuration: `${2 + Math.random() * 2}s`
              }}
            >
              <Sparkles className="w-4 h-4 text-brand-yellow" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DailyGoals; 