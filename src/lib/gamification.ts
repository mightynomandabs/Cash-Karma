import { supabase } from "@/integrations/supabase/client";

// XP requirements per level
export const XP_PER_LEVEL = [0, 100, 250, 500, 1000, 2000, 4000, 8000, 16000, 32000];

// Level titles
export const LEVEL_TITLES = [
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

// XP rewards
export const XP_REWARDS = {
  SEND_DROP: 10,
  RECEIVE_DROP: 5,
  STREAK_BONUS: 5,
  DAILY_GOAL: 25,
  FIRST_DROP: 50,
  MILESTONE_10: 100,
  MILESTONE_50: 500,
  MILESTONE_100: 1000
};

// Achievement definitions
export const ACHIEVEMENTS = {
  FIRST_DROP: {
    id: 'first-drop',
    name: 'First Drop',
    description: 'Sent your first karma drop',
    xpReward: 50
  },
  STREAK_3: {
    id: 'streak-3',
    name: '3-Day Streak',
    description: 'Sent drops for 3 consecutive days',
    xpReward: 100
  },
  STREAK_7: {
    id: 'streak-7',
    name: 'Week Warrior',
    description: 'Sent drops for 7 consecutive days',
    xpReward: 250
  },
  STREAK_30: {
    id: 'streak-30',
    name: 'Monthly Master',
    description: 'Sent drops for 30 consecutive days',
    xpReward: 1000
  },
  GENEROUS_10: {
    id: 'generous-10',
    name: 'Generous Soul',
    description: 'Sent 10 karma drops',
    xpReward: 200
  },
  GENEROUS_50: {
    id: 'generous-50',
    name: 'Karma Master',
    description: 'Sent 50 karma drops',
    xpReward: 500
  },
  GENEROUS_100: {
    id: 'generous-100',
    name: 'Karma Legend',
    description: 'Sent 100 karma drops',
    xpReward: 1000
  },
  LEVEL_5: {
    id: 'level-5',
    name: 'Level 5 Achiever',
    description: 'Reached level 5',
    xpReward: 100
  },
  LEVEL_10: {
    id: 'level-10',
    name: 'Level 10 Master',
    description: 'Reached level 10',
    xpReward: 500
  },
  BIG_DROP: {
    id: 'big-drop',
    name: 'Big Spender',
    description: 'Sent a drop of ₹100 or more',
    xpReward: 50
  }
};

export interface LevelProgress {
  currentLevel: number;
  currentXP: number;
  xpForCurrentLevel: number;
  xpForNextLevel: number;
  progress: number;
  xpToNext: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  xpReward: number;
  unlocked: boolean;
  unlockedAt?: string;
}

export class GamificationService {
  // Calculate level progress
  static calculateLevelProgress(currentXP: number): LevelProgress {
    let currentLevel = 1;
    let xpForCurrentLevel = 0;
    let xpForNextLevel = XP_PER_LEVEL[1];

    // Find current level
    for (let i = 0; i < XP_PER_LEVEL.length; i++) {
      if (currentXP >= XP_PER_LEVEL[i]) {
        currentLevel = i + 1;
        xpForCurrentLevel = XP_PER_LEVEL[i];
        xpForNextLevel = XP_PER_LEVEL[i + 1] || XP_PER_LEVEL[i] + 100;
      } else {
        break;
      }
    }

    const progress = ((currentXP - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100;

    return {
      currentLevel,
      currentXP,
      xpForCurrentLevel,
      xpForNextLevel,
      progress: Math.min(progress, 100),
      xpToNext: xpForNextLevel - currentXP
    };
  }

  // Get level title
  static getLevelTitle(level: number): string {
    return LEVEL_TITLES[Math.min(level - 1, LEVEL_TITLES.length - 1)];
  }

  // Award XP to user
  static async awardXP(userId: string, xpAmount: number, reason: string): Promise<void> {
    try {
      // Get current profile
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('karma_points, level')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      const currentXP = profile?.karma_points || 0;
      const newXP = currentXP + xpAmount;
      const oldLevel = profile?.level || 1;

      // Calculate new level
      const levelProgress = this.calculateLevelProgress(newXP);
      const newLevel = levelProgress.currentLevel;

      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          karma_points: newXP,
          level: newLevel
        })
        .eq('user_id', userId);

      if (updateError) throw updateError;

      // Log XP gain
      await supabase
        .from('xp_logs')
        .insert({
          user_id: userId,
          xp_amount: xpAmount,
          reason,
          old_level: oldLevel,
          new_level: newLevel
        });

      // Check for level up
      if (newLevel > oldLevel) {
        await this.handleLevelUp(userId, newLevel);
      }

    } catch (error) {
      console.error('Error awarding XP:', error);
      throw error;
    }
  }

  // Handle level up
  static async handleLevelUp(userId: string, newLevel: number): Promise<void> {
    try {
      // Create level up notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'level_up',
          title: `🎉 Level Up!`,
          message: `Congratulations! You reached Level ${newLevel}: ${this.getLevelTitle(newLevel)}`,
          read: false
        });

      // Award level up bonus XP
      const levelUpBonus = newLevel * 10;
      await this.awardXP(userId, levelUpBonus, `Level ${newLevel} bonus`);

    } catch (error) {
      console.error('Error handling level up:', error);
    }
  }

  // Check and award achievements
  static async checkAchievements(userId: string): Promise<void> {
    try {
      // Get user stats
      const { data: profile, error: fetchError } = await supabase
        .from('profiles')
        .select('total_given, total_received, level')
        .eq('user_id', userId)
        .single();

      if (fetchError) throw fetchError;

      // Get user's drops for streak calculation
      const { data: drops, error: dropsError } = await supabase
        .from('drops')
        .select('created_at')
        .eq('sender_id', userId)
        .order('created_at', { ascending: false })
        .limit(30);

      if (dropsError) throw dropsError;

      // Calculate current streak
      const streak = this.calculateStreak(drops || []);

      // Check each achievement
      const achievementsToCheck = [
        {
          ...ACHIEVEMENTS.FIRST_DROP,
          condition: () => profile?.total_given && profile.total_given > 0
        },
        {
          ...ACHIEVEMENTS.STREAK_3,
          condition: () => streak >= 3
        },
        {
          ...ACHIEVEMENTS.STREAK_7,
          condition: () => streak >= 7
        },
        {
          ...ACHIEVEMENTS.STREAK_30,
          condition: () => streak >= 30
        },
        {
          ...ACHIEVEMENTS.GENEROUS_10,
          condition: () => profile?.total_given && profile.total_given >= 10
        },
        {
          ...ACHIEVEMENTS.GENEROUS_50,
          condition: () => profile?.total_given && profile.total_given >= 50
        },
        {
          ...ACHIEVEMENTS.GENEROUS_100,
          condition: () => profile?.total_given && profile.total_given >= 100
        },
        {
          ...ACHIEVEMENTS.LEVEL_5,
          condition: () => profile?.level && profile.level >= 5
        },
        {
          ...ACHIEVEMENTS.LEVEL_10,
          condition: () => profile?.level && profile.level >= 10
        }
      ];

      // Check and award achievements
      for (const achievement of achievementsToCheck) {
        if (achievement.condition()) {
          await this.awardAchievement(userId, achievement);
        }
      }

    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  }

  // Award achievement
  static async awardAchievement(userId: string, achievement: any): Promise<void> {
    try {
      // Check if already awarded
      const { data: existing } = await supabase
        .from('achievements')
        .select('id')
        .eq('user_id', userId)
        .eq('achievement_id', achievement.id)
        .single();

      if (existing) return; // Already awarded

      // Award achievement
      await supabase
        .from('achievements')
        .insert({
          user_id: userId,
          achievement_id: achievement.id,
          unlocked_at: new Date().toISOString()
        });

      // Award XP
      await this.awardXP(userId, achievement.xpReward, `Achievement: ${achievement.name}`);

      // Create notification
      await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: 'achievement',
          title: `🏆 Achievement Unlocked!`,
          message: `${achievement.name}: ${achievement.description}`,
          read: false
        });

    } catch (error) {
      console.error('Error awarding achievement:', error);
    }
  }

  // Calculate streak
  static calculateStreak(drops: any[]): number {
    if (drops.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let streak = 0;
    let currentDate = new Date(today);

    for (let i = 0; i < 30; i++) {
      const dropOnDate = drops.find(drop => {
        const dropDate = new Date(drop.created_at);
        dropDate.setHours(0, 0, 0, 0);
        return dropDate.getTime() === currentDate.getTime();
      });

      if (dropOnDate) {
        streak++;
      } else {
        break;
      }

      currentDate.setDate(currentDate.getDate() - 1);
    }

    return streak;
  }

  // Get user achievements
  static async getUserAchievements(userId: string): Promise<Achievement[]> {
    try {
      const { data: userAchievements, error } = await supabase
        .from('achievements')
        .select('achievement_id, unlocked_at')
        .eq('user_id', userId);

      if (error) throw error;

      const unlockedAchievementIds = userAchievements?.map(ua => ua.achievement_id) || [];

      return Object.values(ACHIEVEMENTS).map(achievement => ({
        ...achievement,
        unlocked: unlockedAchievementIds.includes(achievement.id),
        unlockedAt: userAchievements?.find(ua => ua.achievement_id === achievement.id)?.unlocked_at
      }));

    } catch (error) {
      console.error('Error fetching user achievements:', error);
      return [];
    }
  }
} 