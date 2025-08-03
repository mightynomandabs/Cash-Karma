import React from 'react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Star, Zap, Trophy, Crown } from 'lucide-react'

interface LevelProgressProps {
  currentXp: number
  nextLevelXp: number
  level: number
}

export const LevelProgress: React.FC<LevelProgressProps> = ({ 
  currentXp, 
  nextLevelXp, 
  level 
}) => {
  const progressPercentage = (currentXp / nextLevelXp) * 100
  const xpNeeded = nextLevelXp - currentXp

  const getLevelTitle = (level: number) => {
    if (level < 5) return "Karma Beginner"
    if (level < 10) return "Karma Enthusiast"
    if (level < 20) return "Karma Warrior"
    if (level < 50) return "Karma Master"
    if (level < 100) return "Karma Legend"
    return "Karma Deity"
  }

  const getLevelIcon = (level: number) => {
    if (level < 5) return <Star className="w-4 h-4 text-yellow-500" />
    if (level < 10) return <Zap className="w-4 h-4 text-blue-500" />
    if (level < 20) return <Trophy className="w-4 h-4 text-orange-500" />
    if (level < 50) return <Crown className="w-4 h-4 text-purple-500" />
    return <Crown className="w-4 h-4 text-red-500" />
  }

  const getLevelColor = (level: number) => {
    if (level < 5) return "bg-yellow-100 text-yellow-800 border-yellow-200"
    if (level < 10) return "bg-blue-100 text-blue-800 border-blue-200"
    if (level < 20) return "bg-orange-100 text-orange-800 border-orange-200"
    if (level < 50) return "bg-purple-100 text-purple-800 border-purple-200"
    return "bg-red-100 text-red-800 border-red-200"
  }

  const getProgressColor = (level: number) => {
    if (level < 5) return "from-yellow-400 to-orange-400"
    if (level < 10) return "from-blue-400 to-purple-400"
    if (level < 20) return "from-orange-400 to-red-400"
    if (level < 50) return "from-purple-400 to-pink-400"
    return "from-red-400 to-pink-400"
  }

  return (
    <div className="space-y-4">
      {/* Level Display */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            {getLevelIcon(level)}
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-800">Level {level}</span>
                <Badge className={getLevelColor(level)}>
                  {getLevelTitle(level)}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {xpNeeded > 0 ? `${xpNeeded} XP to next level` : 'Ready to level up!'}
              </p>
            </div>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-lg font-bold text-gray-800">
            {currentXp.toLocaleString()}
          </div>
          <div className="text-sm text-gray-500">
            / {nextLevelXp.toLocaleString()} XP
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span className="text-gray-600">Progress</span>
          <span className="text-gray-800 font-medium">
            {Math.round(progressPercentage)}%
          </span>
        </div>
        
        <div className="relative">
          <Progress 
            value={progressPercentage} 
            className="h-3 bg-gray-200"
          />
          <div 
            className={`absolute inset-0 h-3 bg-gradient-to-r ${getProgressColor(level)} rounded-full transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
          
          {/* XP gained indicator */}
          {progressPercentage > 90 && (
            <div className="absolute -top-8 right-0 bg-green-500 text-white text-xs px-2 py-1 rounded-full animate-pulse">
              Almost there!
            </div>
          )}
        </div>
      </div>

      {/* Level Rewards */}
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-gray-700">Level Rewards</h4>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center space-x-2 p-2 bg-green-50 rounded-lg">
            <Star className="w-4 h-4 text-green-600" />
            <span className="text-xs text-green-700">+{level * 10} Karma Points</span>
          </div>
          <div className="flex items-center space-x-2 p-2 bg-blue-50 rounded-lg">
            <Zap className="w-4 h-4 text-blue-600" />
            <span className="text-xs text-blue-700">+{Math.floor(level / 5)} Daily Drops</span>
          </div>
        </div>
      </div>

      {/* Next Level Preview */}
      {xpNeeded > 0 && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border border-purple-200">
          <div className="flex items-center space-x-2">
            <Star className="w-4 h-4 text-purple-600" />
            <div>
              <p className="text-sm font-medium text-purple-800">
                Next Level: {getLevelTitle(level + 1)}
              </p>
              <p className="text-xs text-purple-600">
                Unlock new rewards and features!
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Level Up Animation (when ready) */}
      {progressPercentage >= 100 && (
        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-lg border border-yellow-200 animate-pulse">
          <div className="flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-yellow-600" />
            <span className="text-sm font-medium text-yellow-800">
              Ready to level up! 🎉
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 