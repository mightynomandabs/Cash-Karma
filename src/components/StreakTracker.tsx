import React from 'react'
import { Flame, Calendar, Target } from 'lucide-react'

interface StreakTrackerProps {
  currentStreak: number
}

export const StreakTracker: React.FC<StreakTrackerProps> = ({ currentStreak }) => {
  const getStreakMessage = (streak: number) => {
    if (streak === 0) return "Start your streak today!"
    if (streak === 1) return "Great start! Keep it going!"
    if (streak < 7) return "You're building momentum!"
    if (streak < 30) return "Impressive dedication!"
    if (streak < 100) return "You're a streak master!"
    return "Legendary streak! 🔥"
  }

  const getStreakColor = (streak: number) => {
    if (streak === 0) return "text-gray-400"
    if (streak < 3) return "text-orange-500"
    if (streak < 7) return "text-orange-600"
    if (streak < 30) return "text-red-500"
    return "text-red-600"
  }

  const getFlameSize = (streak: number) => {
    if (streak === 0) return "w-4 h-4"
    if (streak < 3) return "w-5 h-5"
    if (streak < 7) return "w-6 h-6"
    if (streak < 30) return "w-7 h-7"
    return "w-8 h-8"
  }

  const getFlameAnimation = (streak: number) => {
    if (streak === 0) return ""
    if (streak < 3) return "animate-pulse"
    if (streak < 7) return "animate-pulse"
    if (streak < 30) return "animate-pulse"
    return "animate-pulse"
  }

  return (
    <div className="space-y-4">
      {/* Current Streak Display */}
      <div className="text-center">
        <div className="flex items-center justify-center space-x-2 mb-2">
          <Flame 
            className={`${getFlameSize(currentStreak)} ${getStreakColor(currentStreak)} ${getFlameAnimation(currentStreak)}`}
          />
          <span className="text-2xl font-bold text-gray-800">
            {currentStreak}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">Current Streak</p>
        <p className="text-xs text-gray-500">{getStreakMessage(currentStreak)}</p>
      </div>

      {/* Daily Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600 flex items-center">
            <Calendar className="w-4 h-4 mr-1" />
            Today's Goal
          </span>
          <span className="text-gray-800 font-medium">1 drop</span>
        </div>
        
        <div className="relative">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-500"
              style={{ width: currentStreak > 0 ? '100%' : '0%' }}
            />
          </div>
          <div className="absolute -top-1 -right-1">
            {currentStreak > 0 ? (
              <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white text-xs">✓</span>
              </div>
            ) : (
              <div className="w-4 h-4 bg-gray-300 rounded-full flex items-center justify-center">
                <span className="text-gray-500 text-xs">○</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Streak Milestones */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Next milestone</span>
          <span className="text-gray-700 font-medium">
            {currentStreak < 3 ? '3 days' : currentStreak < 7 ? '7 days' : currentStreak < 30 ? '30 days' : '100 days'}
          </span>
        </div>
        
        <div className="flex space-x-1">
          {[3, 7, 30, 100].map((milestone) => (
            <div
              key={milestone}
              className={`flex-1 h-1 rounded-full ${
                currentStreak >= milestone 
                  ? 'bg-gradient-to-r from-orange-400 to-red-500' 
                  : 'bg-gray-200'
              }`}
            />
          ))}
        </div>
        
        <div className="flex justify-between text-xs text-gray-500">
          <span>3d</span>
          <span>7d</span>
          <span>30d</span>
          <span>100d</span>
        </div>
      </div>

      {/* Motivational Message */}
      {currentStreak > 0 && (
        <div className="bg-gradient-to-r from-orange-50 to-red-50 p-3 rounded-lg border border-orange-200">
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-orange-600" />
            <span className="text-sm font-medium text-orange-800">
              {currentStreak === 1 && "First day complete! 🎉"}
              {currentStreak === 3 && "3-day streak unlocked! 🔥"}
              {currentStreak === 7 && "Week streak achieved! ⭐"}
              {currentStreak === 30 && "Month streak! Legendary! 👑"}
              {currentStreak > 30 && "Incredible dedication! 🌟"}
            </span>
          </div>
        </div>
      )}
    </div>
  )
} 