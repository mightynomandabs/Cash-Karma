import React, { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { 
  LogOut, 
  User, 
  Mail, 
  Sparkles, 
  Settings,
  TrendingUp,
  Gift,
  Users,
  Bell,
  Flame,
  Star,
  Trophy,
  Heart,
  Share2,
  Plus,
  Eye,
  Crown,
  Target,
  Calendar,
  Zap,
  ArrowUpRight,
  ChevronRight,
  Send,
  Award,
  Edit
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { DropCreationModal } from './DropCreationModal'
import { ActivityFeed } from './ActivityFeed'
import { NotificationDropdown } from './NotificationDropdown'
import { StreakTracker } from './StreakTracker'
import { LevelProgress } from './LevelProgress'
import { AchievementBadge } from './AchievementBadge'

interface UserStats {
  totalKarma: number
  dropsSent: number
  peopleHelped: number
  currentStreak: number
  level: number
  xp: number
  nextLevelXp: number
}

interface RecentDrop {
  id: number
  name: string
  amount: number
  message: string
  time: string
  avatar: string
  type: 'sent' | 'received'
}

interface Achievement {
  id: number
  name: string
  icon: string
  unlocked: boolean
}

interface DailyGoal {
  current: number
  target: number
  description: string
}

// Enhanced Stats Cards Component
const StatsCards = () => {
  const stats = [
    { 
      id: 1, 
      title: 'Total Karma', 
      value: 1250, 
      icon: Star, 
      color: 'text-brand-yellow',
      bgColor: 'bg-brand-yellow/10',
      change: '+12%'
    },
    { 
      id: 2, 
      title: 'Drops Sent', 
      value: 47, 
      icon: Send, 
      color: 'text-brand-green',
      bgColor: 'bg-brand-green/10',
      change: '+3 today'
    },
    { 
      id: 3, 
      title: 'People Helped', 
      value: 32, 
      icon: Users, 
      color: 'text-brand-pink',
      bgColor: 'bg-brand-pink/10',
      change: '+2 this week'
    },
    { 
      id: 4, 
      title: 'Current Streak', 
      value: 7, 
      icon: Flame, 
      color: 'text-brand-yellow',
      bgColor: 'bg-brand-yellow/10',
      suffix: 'days',
      streak: true
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {stats.map((stat) => (
        <div key={stat.id} className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between">
            <div className={`p-3 rounded-lg ${stat.bgColor}`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            {stat.streak && (
              <div className="animate-pulse">
                <Flame className="w-5 h-5 text-brand-yellow" />
              </div>
            )}
          </div>
          <div className="mt-3 sm:mt-4">
            <h3 className="text-xs sm:text-sm font-medium text-muted-foreground">{stat.title}</h3>
            <div className="flex items-baseline">
              <p className="text-lg sm:text-2xl font-semibold text-foreground">
                {stat.value}
              </p>
              {stat.suffix && (
                <span className="ml-1 text-xs sm:text-sm text-muted-foreground">{stat.suffix}</span>
              )}
            </div>
            {stat.change && (
              <p className="text-xs sm:text-sm text-brand-green mt-1">{stat.change}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

// Enhanced Profile Card Component
const ProfileCard = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showEmail, setShowEmail] = useState(false);
  
  const [profile, setProfile] = useState({
    name: 'Alex Kumar',
    avatar: 'AK',
    email: 'alex@example.com',
    joinDate: 'March 2024',
    level: 5,
    title: 'Karma Warrior',
    xp: 850,
    nextLevelXp: 1000
  });

  const maskEmail = (email: string) => {
    const [name, domain] = email.split('@');
    return `${name.slice(0, 3)}***@${domain}`;
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Profile</h2>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="p-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <Edit className="w-4 h-4" />
        </button>
      </div>
      
      <div className="text-center mb-6">
        <div className="relative inline-block">
          <div className="w-20 h-20 rounded-full bg-gradient-to-r from-brand-green to-brand-yellow flex items-center justify-center text-white text-xl font-semibold mx-auto mb-3">
            {profile.avatar}
          </div>
          {isEditing && (
            <button className="absolute bottom-0 right-0 bg-card rounded-full p-1 shadow-lg border border-border">
              <Edit className="w-3 h-3 text-muted-foreground" />
            </button>
          )}
        </div>
        
        {isEditing ? (
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({...profile, name: e.target.value})}
            className="text-lg sm:text-xl font-semibold text-center border-b border-border bg-transparent focus:border-brand-green outline-none text-foreground"
          />
        ) : (
          <h3 className="text-lg sm:text-xl font-semibold text-foreground">{profile.name}</h3>
        )}
        
        <div className="flex items-center justify-center mt-2">
          <Award className="w-4 h-4 text-brand-yellow mr-1" />
          <span className="text-sm text-muted-foreground">Level {profile.level} - {profile.title}</span>
        </div>

        {/* XP Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between text-sm text-muted-foreground mb-1">
            <span>{profile.xp} XP</span>
            <span>{profile.nextLevelXp} XP</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-brand-green to-brand-yellow h-2 rounded-full transition-all duration-500"
              style={{ width: `${(profile.xp / profile.nextLevelXp) * 100}%` }}
            ></div>
          </div>
          <p className="text-xs text-muted-foreground mt-1">
            {profile.nextLevelXp - profile.xp} XP to next level
          </p>
        </div>
      </div>

      <div className="space-y-3 text-xs sm:text-sm">
        <div className="flex justify-between items-center">
          <span className="text-muted-foreground">Email</span>
          <div className="flex items-center">
            <span className="text-foreground mr-2">
              {showEmail ? profile.email : maskEmail(profile.email)}
            </span>
            <button
              onClick={() => setShowEmail(!showEmail)}
              className="text-muted-foreground hover:text-foreground"
            >
              {showEmail ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
        </div>
        <div className="flex justify-between">
          <span className="text-muted-foreground">Joined</span>
          <span className="text-foreground">{profile.joinDate}</span>
        </div>
      </div>
    </div>
  );
};

// Enhanced Activity Feed Component
const EnhancedActivityFeed = () => {
  const [activities, setActivities] = useState([
    {
      id: 1,
      type: 'received',
      name: 'Priya S',
      avatar: 'PS',
      amount: 50,
      message: 'Hope this brightens your day! 🌟',
      time: '2 mins ago',
      reactions: { likes: 3, hearts: 1 },
      userReacted: false
    },
    {
      id: 2,
      type: 'sent',
      name: 'Rahul M',
      avatar: 'RM', 
      amount: 10,
      message: 'Random act of kindness!',
      time: '15 mins ago',
      reactions: { likes: 1, hearts: 2 },
      userReacted: true
    }
  ]);

  const handleReaction = (activityId: number, reactionType: string) => {
    setActivities(activities.map(activity => {
      if (activity.id === activityId) {
        const newReactions = { ...activity.reactions };
        if (activity.userReacted) {
          newReactions[reactionType as keyof typeof newReactions]--;
        } else {
          newReactions[reactionType as keyof typeof newReactions]++;
        }
        return {
          ...activity,
          reactions: newReactions,
          userReacted: !activity.userReacted
        };
      }
      return activity;
    }));
  };

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
      <div className="flex items-center justify-between mb-4 sm:mb-6">
        <h2 className="text-base sm:text-lg font-semibold text-foreground">Recent Activity</h2>
        <button className="text-xs sm:text-sm text-brand-green hover:text-brand-green/80">
          View All
        </button>
      </div>

      <div className="space-y-3 sm:space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="flex items-start space-x-2 sm:space-x-3 p-2 sm:p-3 rounded-lg hover:bg-muted/50 transition-colors">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-r from-brand-green to-brand-yellow flex items-center justify-center text-white text-xs sm:text-sm font-semibold flex-shrink-0">
              {activity.avatar}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs sm:text-sm font-medium text-foreground">
                  {activity.type === 'sent' ? 'You sent' : 'You received'} ₹{activity.amount}
                  {activity.type === 'sent' ? ` to ${activity.name}` : ` from ${activity.name}`}
                </p>
                <span className="text-xs text-muted-foreground">{activity.time}</span>
              </div>
              
              {activity.message && (
                <p className="text-xs sm:text-sm text-muted-foreground mt-1">"{activity.message}"</p>
              )}
              
              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <button
                    onClick={() => handleReaction(activity.id, 'likes')}
                    className={`flex items-center space-x-1 text-xs transition-colors ${
                      activity.userReacted ? 'text-brand-green' : 'text-muted-foreground hover:text-brand-green'
                    }`}
                  >
                    <span>👍</span>
                    <span>{activity.reactions.likes}</span>
                  </button>
                  
                  <button
                    onClick={() => handleReaction(activity.id, 'hearts')}
                    className="flex items-center space-x-1 text-xs text-muted-foreground hover:text-brand-pink transition-colors"
                  >
                    <span>❤️</span>
                    <span>{activity.reactions.hearts}</span>
                  </button>
                </div>
                
                <button className="text-xs text-muted-foreground hover:text-foreground flex items-center">
                  <Share2 className="w-3 h-3 mr-1" />
                  Share
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Enhanced Achievements Card Component
const AchievementsCard = () => {
  const achievements = [
    { id: 1, name: '3-Day Streak', description: 'Send drops for 3 consecutive days', icon: '🔥', unlocked: true, progress: 100 },
    { id: 2, name: 'Level 5', description: 'Reach Level 5 Karma Warrior', icon: '⭐', unlocked: true, progress: 100 },
    { id: 3, name: 'Generous Giver', description: 'Send 100 drops total', icon: '💝', unlocked: false, progress: 47 },
    { id: 4, name: 'Community Builder', description: 'Help 50 people', icon: '🏗️', unlocked: false, progress: 64 }
  ];

  return (
    <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
      <h2 className="text-base sm:text-lg font-semibold text-foreground mb-4">Achievements</h2>
      
      <div className="grid grid-cols-2 gap-2 sm:gap-3">
        {achievements.map((achievement) => (
          <div key={achievement.id} className={`p-4 rounded-lg border-2 transition-all ${
            achievement.unlocked 
              ? 'border-brand-green/30 bg-brand-green/5' 
              : 'border-border bg-muted/30'
          }`}>
            <div className="text-center">
              <div className={`text-2xl mb-2 ${ achievement.unlocked ? '' : 'grayscale opacity-50' }`}>
                {achievement.icon}
              </div>
              <h3 className={`text-sm font-medium ${
                achievement.unlocked ? 'text-foreground' : 'text-muted-foreground'
              }`}>
                {achievement.name}
              </h3>
              <p className="text-xs text-muted-foreground mt-1">{achievement.description}</p>
              
              {!achievement.unlocked && (
                <div className="mt-2">
                  <div className="w-full bg-muted rounded-full h-1">
                    <div 
                      className="bg-gradient-to-r from-brand-green to-brand-yellow h-1 rounded-full transition-all"
                      style={{ width: `${achievement.progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{achievement.progress}%</p>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export const UserDashboard: React.FC = () => {
  const { user, signOut } = useAuth()
  const [showDropModal, setShowDropModal] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [unreadNotifications, setUnreadNotifications] = useState(3)

  // Mock data - in real app this would come from API
  const [userStats] = useState<UserStats>({
    totalKarma: 1250,
    dropsSent: 47,
    peopleHelped: 32,
    currentStreak: 7,
    level: 5,
    xp: 850,
    nextLevelXp: 1000
  })

  const [recentDrops] = useState<RecentDrop[]>([
    { id: 1, name: "Priya S", amount: 50, message: "Hope this brightens your day! 🌟", time: "2 mins ago", avatar: "PS", type: "received" },
    { id: 2, name: "Rahul M", amount: 10, message: "Random act of kindness!", time: "15 mins ago", avatar: "RM", type: "sent" },
    { id: 3, name: "Anjali K", amount: 25, message: "Sending good vibes! 💫", time: "1 hour ago", avatar: "AK", type: "received" },
    { id: 4, name: "Vikram P", amount: 100, message: "Because kindness rocks! 🌟", time: "2 hours ago", avatar: "VP", type: "sent" },
    { id: 5, name: "Meera L", amount: 5, message: "Pay it forward! 🙏", time: "3 hours ago", avatar: "ML", type: "received" }
  ])

  const [achievements] = useState<Achievement[]>([
    { id: 1, name: "3-Day Streak", icon: "🔥", unlocked: true },
    { id: 2, name: "Level 5", icon: "⭐", unlocked: true },
    { id: 3, name: "Generous Giver", icon: "💝", unlocked: false },
    { id: 4, name: "Karma Pioneer", icon: "👑", unlocked: true }
  ])

  const [dailyGoal] = useState<DailyGoal>({
    current: 342,
    target: 500,
    description: "Help us hit 500 ₹10 drops today!"
  })

  const handleSignOut = async () => {
    await signOut()
    window.location.href = '/'
  }

  const getUserDisplayName = () => {
    return user?.user_metadata?.display_name || 
           user?.email?.split('@')[0] || 
           'Karma Warrior'
  }

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || 
           'https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user?.email || 'default')
  }

  const getMotivationalMessage = () => {
    const messages = [
      "Every drop creates a ripple of kindness! 🌊",
      "You're making the world a better place! ✨",
      "Your generosity inspires others! 💫",
      "Keep spreading those good vibes! 🌟",
      "Today is perfect for random acts of kindness! 🎉"
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  return (
    <div className="pt-16 min-h-screen bg-background">
      <div className="max-w-7xl mx-auto p-3 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <div className="lg:col-span-2 space-y-4 sm:space-y-6">
            <StatsCards />
            <div className="bg-card rounded-xl p-4 sm:p-6 shadow-sm border border-border">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0 mb-4">
                <h2 className="text-base sm:text-lg font-semibold text-foreground">Send a Drop</h2>
                <button
                  onClick={() => setShowDropModal(true)}
                  className="bg-gradient-to-r from-brand-green to-brand-yellow text-white px-3 sm:px-4 py-2 rounded-lg hover:from-brand-green/90 hover:to-brand-yellow/90 transition-all transform hover:scale-105 text-sm sm:text-base"
                >
                  <Plus className="w-4 h-4 mr-2 inline" />
                  Send Drop
                </button>
              </div>
              <p className="text-sm sm:text-base text-muted-foreground">Spread kindness with micro-donations</p>
            </div>
            <EnhancedActivityFeed />
          </div>
          <div className="space-y-4 sm:space-y-6">
            <ProfileCard />
            <AchievementsCard />
          </div>
        </div>
      </div>

      {/* Drop Creation Modal */}
      <DropCreationModal 
        isOpen={showDropModal}
        onClose={() => setShowDropModal(false)}
        onDropCreated={() => {
          setShowDropModal(false)
          // Refresh data or show success message
        }}
      />
    </div>
  )
} 