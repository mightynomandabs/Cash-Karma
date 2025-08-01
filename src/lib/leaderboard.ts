import { supabase } from "@/integrations/supabase/client";

export interface LeaderboardStats {
  totalDrops: number;
  totalReceived: number;
  currentStreak: number;
  longestStreak: number;
  weeklyRank: number | null;
  allTimeRank: number | null;
}

export class LeaderboardService {
  /**
   * Calculate and update leaderboard entries for a user
   */
  static async updateUserLeaderboard(userId: string): Promise<void> {
    try {
      // Get user's drop statistics
      const { data: drops } = await supabase
        .from('drops')
        .select('created_at, amount')
        .eq('sender_id', userId)
        .eq('status', 'paid');

      if (!drops || drops.length === 0) return;

      // Calculate weekly stats (current week)
      const now = new Date();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const weeklyDrops = drops.filter(drop => new Date(drop.created_at) >= weekStart);
      
      // Calculate all-time stats
      const allTimeDrops = drops.length;
      const totalAmount = drops.reduce((sum, drop) => sum + drop.amount, 0);

      // Calculate streak
      const streak = this.calculateStreak(drops);

      // Update weekly leaderboard entries
      await this.upsertLeaderboardEntry(userId, 'weekly', 'droppers', weeklyDrops.length, weekStart);
      await this.upsertLeaderboardEntry(userId, 'weekly', 'streak_masters', streak.current, weekStart);
      
      // Update all-time leaderboard entries
      await this.upsertLeaderboardEntry(userId, 'all_time', 'droppers', allTimeDrops, new Date(0));
      await this.upsertLeaderboardEntry(userId, 'all_time', 'streak_masters', streak.longest, new Date(0));

      // Update user's profile with streak info
      await supabase
        .from('profiles')
        .update({
          total_given: allTimeDrops,
          karma_points: totalAmount
        })
        .eq('user_id', userId);

    } catch (error) {
      console.error('Error updating leaderboard:', error);
      throw error;
    }
  }

  /**
   * Calculate user's current and longest streaks
   */
  static calculateStreak(drops: Array<{ created_at: string }>): { current: number; longest: number } {
    if (!drops || drops.length === 0) {
      return { current: 0, longest: 0 };
    }

    // Sort drops by date (newest first)
    const sortedDrops = drops
      .map(drop => new Date(drop.created_at))
      .sort((a, b) => b.getTime() - a.getTime());

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let lastDate: Date | null = null;

    for (const dropDate of sortedDrops) {
      if (!lastDate) {
        currentStreak = 1;
        tempStreak = 1;
        lastDate = dropDate;
        continue;
      }

      const daysDiff = Math.floor((lastDate.getTime() - dropDate.getTime()) / (1000 * 60 * 60 * 24));

      if (daysDiff === 1) {
        // Consecutive day
        tempStreak++;
        if (currentStreak === 0) {
          currentStreak = tempStreak;
        }
      } else if (daysDiff === 0) {
        // Same day, continue streak
        continue;
      } else {
        // Streak broken
        longestStreak = Math.max(longestStreak, tempStreak);
        tempStreak = 1;
        if (currentStreak > 0) {
          break; // Current streak is broken
        }
      }

      lastDate = dropDate;
    }

    // Update longest streak if current streak is longer
    longestStreak = Math.max(longestStreak, tempStreak);

    return { current: currentStreak, longest: longestStreak };
  }

  /**
   * Upsert leaderboard entry
   */
  static async upsertLeaderboardEntry(
    userId: string,
    periodType: 'weekly' | 'all_time',
    category: 'droppers' | 'receivers' | 'streak_masters',
    score: number,
    periodStart: Date
  ): Promise<void> {
    const periodEnd = new Date(periodStart);
    if (periodType === 'weekly') {
      periodEnd.setDate(periodEnd.getDate() + 6);
    } else {
      periodEnd.setFullYear(periodEnd.getFullYear() + 100); // Far future for all-time
    }

    const { error } = await supabase
      .from('leaderboard_entries')
      .upsert({
        user_id: userId,
        period_type: periodType,
        category,
        score,
        period_start: periodStart.toISOString().split('T')[0],
        period_end: periodEnd.toISOString().split('T')[0]
      }, {
        onConflict: 'user_id,period_type,category,period_start'
      });

    if (error) throw error;
  }

  /**
   * Get user's leaderboard statistics
   */
  static async getUserStats(userId: string): Promise<LeaderboardStats> {
    try {
      // Get user's drops
      const { data: drops } = await supabase
        .from('drops')
        .select('created_at, amount')
        .eq('sender_id', userId)
        .eq('status', 'paid');

      if (!drops) {
        return {
          totalDrops: 0,
          totalReceived: 0,
          currentStreak: 0,
          longestStreak: 0,
          weeklyRank: null,
          allTimeRank: null
        };
      }

      // Calculate basic stats
      const totalDrops = drops.length;
      const totalAmount = drops.reduce((sum, drop) => sum + drop.amount, 0);
      const streak = this.calculateStreak(drops);

      // Get user's ranks
      const weeklyRank = await this.getUserRank(userId, 'weekly', 'droppers');
      const allTimeRank = await this.getUserRank(userId, 'all_time', 'droppers');

      return {
        totalDrops,
        totalReceived: 0, // TODO: Implement when receiving is added
        currentStreak: streak.current,
        longestStreak: streak.longest,
        weeklyRank,
        allTimeRank
      };
    } catch (error) {
      console.error('Error getting user stats:', error);
      throw error;
    }
  }

  /**
   * Get user's rank in a specific category and period
   */
  static async getUserRank(
    userId: string,
    periodType: 'weekly' | 'all_time',
    category: 'droppers' | 'receivers' | 'streak_masters'
  ): Promise<number | null> {
    try {
      const { data, error } = await supabase
        .rpc('get_user_rank', {
          p_user_id: userId,
          p_period_type: periodType,
          p_category: category
        });

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error getting user rank:', error);
      return null;
    }
  }

  /**
   * Get top performers for a category and period
   */
  static async getTopPerformers(
    periodType: 'weekly' | 'all_time',
    category: 'droppers' | 'receivers' | 'streak_masters',
    limit: number = 10
  ) {
    try {
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
        .eq('period_type', periodType)
        .eq('category', category)
        .order('score', { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error getting top performers:', error);
      throw error;
    }
  }

  /**
   * Update all leaderboards (called periodically)
   */
  static async updateAllLeaderboards(): Promise<void> {
    try {
      // Get all users with drops
      const { data: users } = await supabase
        .from('profiles')
        .select('user_id')
        .gt('total_given', 0);

      if (!users) return;

      // Update leaderboard for each user
      for (const user of users) {
        await this.updateUserLeaderboard(user.user_id);
      }
    } catch (error) {
      console.error('Error updating all leaderboards:', error);
      throw error;
    }
  }
} 