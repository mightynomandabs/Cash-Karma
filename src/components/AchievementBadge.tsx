import React from 'react'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Lock, Unlock, Crown, Star, Trophy, Zap } from 'lucide-react'

interface Achievement {
  id: number
  name: string
  icon: string
  unlocked: boolean
}

interface AchievementBadgeProps {
  achievement: Achievement
}

export const AchievementBadge: React.FC<AchievementBadgeProps> = ({ achievement }) => {
  const getAchievementIcon = (icon: string) => {
    switch (icon) {
      case '🔥':
        return <Zap className="w-4 h-4 text-orange-500" />
      case '⭐':
        return <Star className="w-4 h-4 text-yellow-500" />
      case '💝':
        return <Trophy className="w-4 h-4 text-pink-500" />
      case '👑':
        return <Crown className="w-4 h-4 text-purple-500" />
      default:
        return <span className="text-lg">{icon}</span>
    }
  }

  const getAchievementColor = (unlocked: boolean) => {
    if (unlocked) {
      return "bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 hover:from-yellow-100 hover:to-orange-100"
    }
    return "bg-gray-50 border-gray-200 opacity-60"
  }

  const getAchievementTextColor = (unlocked: boolean) => {
    if (unlocked) {
      return "text-gray-800"
    }
    return "text-gray-500"
  }

  const getAchievementIconColor = (unlocked: boolean) => {
    if (unlocked) {
      return "text-yellow-600"
    }
    return "text-gray-400"
  }

  return (
    <Card 
      className={`${getAchievementColor(achievement.unlocked)} transition-all duration-300 hover:scale-105 cursor-pointer ${
        achievement.unlocked ? 'shadow-md hover:shadow-lg' : 'shadow-sm'
      }`}
    >
      <CardContent className="p-3">
        <div className="flex items-center space-x-3">
          {/* Icon */}
          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
            achievement.unlocked 
              ? 'bg-gradient-to-br from-yellow-100 to-orange-100' 
              : 'bg-gray-100'
          }`}>
            {achievement.unlocked ? (
              getAchievementIcon(achievement.icon)
            ) : (
              <Lock className="w-4 h-4 text-gray-400" />
            )}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center space-x-2">
              <h4 className={`text-sm font-medium ${getAchievementTextColor(achievement.unlocked)}`}>
                {achievement.name}
              </h4>
              {achievement.unlocked && (
                <Badge className="bg-green-100 text-green-800 border-green-200 text-xs">
                  <Unlock className="w-3 h-3 mr-1" />
                  Unlocked
                </Badge>
              )}
            </div>
            <p className={`text-xs ${achievement.unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
              {achievement.unlocked 
                ? 'Achievement completed!' 
                : 'Complete requirements to unlock'
              }
            </p>
          </div>
        </div>

        {/* Unlock Animation */}
        {achievement.unlocked && (
          <div className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-orange-400/10 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
        )}
      </CardContent>
    </Card>
  )
} 