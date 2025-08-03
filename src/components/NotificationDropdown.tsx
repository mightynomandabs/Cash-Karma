import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Bell, 
  X, 
  CheckCircle, 
  AlertCircle, 
  Info, 
  Gift, 
  Heart, 
  Crown, 
  Users, 
  TrendingUp,
  Sparkles,
  Flame,
  Star,
  ArrowRight
} from 'lucide-react'

interface Notification {
  id: string
  type: 'success' | 'info' | 'warning' | 'achievement' | 'drop' | 'match' | 'streak'
  title: string
  message: string
  timestamp: Date
  read: boolean
  action?: {
    label: string
    onClick: () => void
  }
  icon?: React.ComponentType<any>
  color: string
  glowColor: string
}

interface NotificationDropdownProps {
  onClose: () => void
  unreadCount: number
}

export const NotificationDropdown: React.FC<NotificationDropdownProps> = ({ 
  onClose, 
  unreadCount 
}) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'New Achievement Unlocked!',
      message: 'You\'ve earned the "Karma Pioneer" badge for reaching 10 drops!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      icon: Crown,
      color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      glowColor: 'shadow-yellow-400/50'
    },
    {
      id: '2',
      type: 'drop',
      title: 'Drop Successful!',
      message: 'Your ₹50 drop has been matched with Education Fund. Impact: 3 students helped!',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
      icon: Gift,
      color: 'bg-green-100 text-green-800 border-green-200',
      glowColor: 'shadow-green-400/50',
      action: {
        label: 'View Impact',
        onClick: () => console.log('View impact')
      }
    },
    {
      id: '3',
      type: 'streak',
      title: 'Streak at Risk!',
      message: 'You\'re 1 day away from losing your 7-day streak. Send a drop to continue!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
      icon: Flame,
      color: 'bg-orange-100 text-orange-800 border-orange-200',
      glowColor: 'shadow-orange-400/50',
      action: {
        label: 'Send Drop',
        onClick: () => console.log('Send drop')
      }
    },
    {
      id: '4',
      type: 'info',
      title: 'Weekly Summary',
      message: 'You\'ve helped 12 causes this week. Total impact: ₹2,400 raised!',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      read: false,
      icon: TrendingUp,
      color: 'bg-blue-100 text-blue-800 border-blue-200',
      glowColor: 'shadow-blue-400/50',
      action: {
        label: 'View Report',
        onClick: () => console.log('View report')
      }
    },
    {
      id: '5',
      type: 'match',
      title: 'Perfect Match!',
      message: 'Your drop was matched with a recipient in under 30 seconds!',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      read: true,
      icon: Heart,
      color: 'bg-pink-100 text-pink-800 border-pink-200',
      glowColor: 'shadow-pink-400/50'
    }
  ])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, read: true }
          : notification
      )
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    )
  }

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id))
  }

  const getNotificationIcon = (notification: Notification) => {
    if (notification.icon) {
      const IconComponent = notification.icon
      return <IconComponent className="w-4 h-4" />
    }
    
    switch (notification.type) {
      case 'success':
        return <CheckCircle className="w-4 h-4" />
      case 'warning':
        return <AlertCircle className="w-4 h-4" />
      case 'info':
        return <Info className="w-4 h-4" />
      case 'achievement':
        return <Crown className="w-4 h-4" />
      case 'drop':
        return <Gift className="w-4 h-4" />
      case 'match':
        return <Heart className="w-4 h-4" />
      case 'streak':
        return <Flame className="w-4 h-4" />
      default:
        return <Bell className="w-4 h-4" />
    }
  }

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date()
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60))
    
    if (diffInMinutes < 1) return 'Just now'
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`
    
    const diffInHours = Math.floor(diffInMinutes / 60)
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    return `${diffInDays}d ago`
  }

  const unreadNotifications = notifications.filter(n => !n.read)

  return (
    <div className="absolute top-16 right-4 z-50">
      <Card className="w-96 bg-white/95 backdrop-blur-md border-0 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-lg font-semibold flex items-center">
            <Bell className="w-5 h-5 mr-2" />
            Notifications
            {unreadCount > 0 && (
              <Badge className="ml-2 bg-red-500 text-white">
                {unreadCount}
              </Badge>
            )}
          </CardTitle>
          <div className="flex items-center space-x-2">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                onClick={markAllAsRead}
                className="text-xs"
              >
                Mark all read
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="h-8 w-8 p-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No notifications yet</p>
                <p className="text-sm">We'll notify you when something happens!</p>
              </div>
            ) : (
              <div className="space-y-1">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`group relative p-4 hover:bg-gray-50/80 transition-colors duration-200 ${
                      !notification.read ? 'bg-blue-50/50' : ''
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      {/* Icon */}
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${notification.color}`}>
                        {getNotificationIcon(notification)}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold text-gray-900 mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-xs text-gray-500">
                                {formatTimeAgo(notification.timestamp)}
                              </span>
                              {notification.action && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={notification.action.onClick}
                                  className="text-xs text-blue-600 hover:text-blue-700"
                                >
                                  {notification.action.label}
                                  <ArrowRight className="w-3 h-3 ml-1" />
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeNotification(notification.id)}
                          className="h-6 w-6 p-0 text-gray-400 hover:text-red-500"
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>

                    {/* Unread indicator */}
                    {!notification.read && (
                      <div className="absolute top-4 left-4 w-2 h-2 bg-blue-500 rounded-full" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="border-t border-gray-200 p-4">
              <Button
                variant="outline"
                className="w-full text-sm"
                onClick={() => console.log('View all notifications')}
              >
                View All Notifications
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
} 