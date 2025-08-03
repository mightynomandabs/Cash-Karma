import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  Gift, 
  Heart, 
  Share2, 
  Clock, 
  ArrowUpRight,
  TrendingUp,
  Users
} from 'lucide-react'

interface RecentDrop {
  id: number
  name: string
  amount: number
  message: string
  time: string
  avatar: string
  type: 'sent' | 'received'
}

interface ActivityFeedProps {
  drops: RecentDrop[]
}

export const ActivityFeed: React.FC<ActivityFeedProps> = ({ drops }) => {
  const getDropIcon = (type: 'sent' | 'received') => {
    return type === 'sent' ? <Gift className="w-4 h-4 text-green-600" /> : <Heart className="w-4 h-4 text-pink-600" />
  }

  const getDropBadgeColor = (type: 'sent' | 'received') => {
    return type === 'sent' 
      ? 'bg-green-100 text-green-800 border-green-200' 
      : 'bg-pink-100 text-pink-800 border-pink-200'
  }

  const getDropBadgeText = (type: 'sent' | 'received') => {
    return type === 'sent' ? 'Sent' : 'Received'
  }

  const handleShare = (drop: RecentDrop) => {
    const shareText = `Just ${drop.type === 'sent' ? 'sent' : 'received'} a ₹${drop.amount} drop on Cash Karma! ${drop.message}`
    
    if (navigator.share) {
      navigator.share({
        title: 'Cash Karma Drop',
        text: shareText,
        url: window.location.href
      })
    } else {
      // Fallback to copying to clipboard
      navigator.clipboard.writeText(shareText)
      // You could add a toast notification here
    }
  }

  return (
    <Card className="bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center">
            <TrendingUp className="w-5 h-5 mr-2 text-primary" />
            Recent Activity
          </CardTitle>
          <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
            <Users className="w-3 h-3 mr-1" />
            {drops.length} drops
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {drops.map((drop) => (
            <div
              key={drop.id}
              className="group relative p-4 bg-white/60 backdrop-blur-sm rounded-lg border border-gray-200/50 hover:border-gray-300/70 hover:shadow-md transition-all duration-300 hover:scale-[1.02]"
            >
              <div className="flex items-start space-x-3">
                {/* Avatar */}
                <Avatar className="w-10 h-10 border-2 border-gray-200">
                  <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${drop.avatar}`} />
                  <AvatarFallback className="bg-gradient-to-br from-purple-100 to-pink-100 text-purple-600 font-semibold">
                    {drop.avatar}
                  </AvatarFallback>
                </Avatar>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <span className="font-semibold text-gray-900">{drop.name}</span>
                      <Badge className={`text-xs ${getDropBadgeColor(drop.type)}`}>
                        {getDropIcon(drop.type)}
                        <span className="ml-1">{getDropBadgeText(drop.type)}</span>
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ₹{drop.amount}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleShare(drop)}
                        className="opacity-0 group-hover:opacity-100 transition-opacity duration-200"
                      >
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Message */}
                  <p className="text-gray-700 text-sm mb-2 leading-relaxed">
                    "{drop.message}"
                  </p>

                  {/* Time and Actions */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <Clock className="w-3 h-3" />
                      <span>{drop.time}</span>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-xs text-gray-600 hover:text-gray-900"
                      >
                        View Details
                        <ArrowUpRight className="w-3 h-3 ml-1" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Hover Effect Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-pink-500/5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />
            </div>
          ))}
        </div>

        {/* Load More Button */}
        <div className="mt-6 text-center">
          <Button
            variant="outline"
            className="bg-white/80 backdrop-blur-sm border-gray-300 hover:bg-white/90"
          >
            View All Activity
            <ArrowUpRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 