import { useState, useEffect, useRef } from "react";
import { Gift, Heart, Users, TrendingUp, Zap, Crown, ChevronUp, ChevronDown, Eye, EyeOff } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface DropActivity {
  id: string;
  user: {
    name: string;
    avatar: string;
    isLegend: boolean;
  };
  amount: number;
  cause: string;
  timestamp: Date;
  type: 'drop' | 'match' | 'milestone';
  message?: string;
}

const RecentDropsTicker = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const tickerRef = useRef<HTMLDivElement>(null);

  const recentDrops: DropActivity[] = [
    {
      id: '1',
      user: {
        name: 'Priya S.',
        avatar: '/src/assets/avatars/astronaut.png',
        isLegend: true
      },
      amount: 50,
      cause: 'Education Fund',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      type: 'drop',
      message: 'Just dropped some karma for education! 📚'
    },
    {
      id: '2',
      user: {
        name: 'Arjun M.',
        avatar: '/src/assets/avatars/robot.png',
        isLegend: false
      },
      amount: 100,
      cause: 'Healthcare Initiative',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'match',
      message: 'Matched with healthcare cause! 🏥'
    },
    {
      id: '3',
      user: {
        name: 'Aisha P.',
        avatar: '/src/assets/avatars/unicorn.png',
        isLegend: true
      },
      amount: 200,
      cause: 'Environmental Protection',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      type: 'milestone',
      message: 'Reached 1000 drops milestone! 🎉'
    },
    {
      id: '4',
      user: {
        name: 'Rahul K.',
        avatar: '/src/assets/avatars/fox.png',
        isLegend: false
      },
      amount: 75,
      cause: 'Animal Welfare',
      timestamp: new Date(Date.now() - 12 * 60 * 1000),
      type: 'drop',
      message: 'Supporting our furry friends! 🐾'
    },
    {
      id: '5',
      user: {
        name: 'Zara K.',
        avatar: '/src/assets/avatars/panda.png',
        isLegend: true
      },
      amount: 150,
      cause: 'Women Empowerment',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      type: 'match',
      message: 'Empowering women through giving! 💪'
    },
    {
      id: '6',
      user: {
        name: 'Vikram S.',
        avatar: '/src/assets/avatars/cat.png',
        isLegend: false
      },
      amount: 25,
      cause: 'Disaster Relief',
      timestamp: new Date(Date.now() - 18 * 60 * 1000),
      type: 'drop',
      message: 'Every bit helps in times of need! 🤝'
    }
  ];

  // Auto-advance ticker
  useEffect(() => {
    if (isPaused || !isVisible) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % recentDrops.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [isPaused, isVisible, recentDrops.length]);

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'drop':
        return <Gift className="w-4 h-4 text-brand-green" />;
      case 'match':
        return <Heart className="w-4 h-4 text-brand-pink" />;
      case 'milestone':
        return <Crown className="w-4 h-4 text-brand-yellow" />;
      default:
        return <Zap className="w-4 h-4 text-brand-green" />;
    }
  };

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'drop':
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
      case 'match':
        return 'bg-brand-pink/10 text-brand-pink border-brand-pink/20';
      case 'milestone':
        return 'bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20';
      default:
        return 'bg-brand-green/10 text-brand-green border-brand-green/20';
    }
  };

  const formatTimeAgo = (timestamp: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays}d ago`;
  };

  if (!isVisible) {
    return (
      <div className="fixed top-32 left-0 right-0 z-40 px-4">
        <div className="max-w-4xl mx-auto">
          <Button
            onClick={() => setIsVisible(true)}
            variant="outline"
            className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl px-4 py-2 text-sm"
          >
            <Eye className="w-4 h-4 mr-2" />
            Show Live Activity
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-32 left-0 right-0 z-40 px-4">
      <div className="max-w-4xl mx-auto">
        <div 
          ref={tickerRef}
          className="bg-background/95 backdrop-blur-xl border border-border/50 rounded-2xl shadow-xl p-4"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-semibold text-foreground">Live Activity</span>
              <Badge variant="outline" className="text-xs bg-green-100 text-green-800 border-green-200">
                {recentDrops.length} recent
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsExpanded(!isExpanded)}
                className="h-6 w-6 p-0"
              >
                {isExpanded ? (
                  <ChevronUp className="w-4 h-4" />
                ) : (
                  <ChevronDown className="w-4 h-4" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="h-6 w-6 p-0"
              >
                <EyeOff className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Activity Display */}
          <div className="relative overflow-hidden">
            <div 
              className="flex transition-transform duration-1000 ease-in-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
              {recentDrops.map((activity, index) => (
                <div 
                  key={activity.id}
                  className="w-full flex-shrink-0 flex items-center gap-3 p-3 bg-muted/30 rounded-xl hover:bg-muted/50 transition-all duration-300 cursor-pointer group"
                >
                  {/* User Avatar */}
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activity.user.avatar} alt={activity.user.name} />
                      <AvatarFallback className="bg-gradient-to-br from-brand-green/20 to-brand-pink/20 text-xs">
                        {activity.user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    {activity.user.isLegend && (
                      <Crown className="absolute -top-1 -right-1 w-3 h-3 text-brand-yellow" />
                    )}
                  </div>

                  {/* Activity Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-foreground truncate">
                        {activity.user.name}
                      </span>
                      {activity.user.isLegend && (
                        <Badge variant="outline" className="text-xs bg-brand-yellow/10 text-brand-yellow border-brand-yellow/20">
                          Legend
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground truncate">
                      {activity.message || `${getActivityIcon(activity.type)} ₹${activity.amount} to ${activity.cause}`}
                    </p>
                  </div>

                  {/* Amount and Time */}
                  <div className="flex flex-col items-end gap-1">
                    <div className="flex items-center gap-1">
                      {getActivityIcon(activity.type)}
                      <span className="text-sm font-bold text-foreground">
                        ₹{activity.amount}
                      </span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {formatTimeAgo(activity.timestamp)}
                    </span>
                  </div>

                  {/* Activity Type Badge */}
                  <Badge variant="outline" className={`text-xs ${getActivityColor(activity.type)}`}>
                    {activity.type}
                  </Badge>
                </div>
              ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-1 mt-3">
              {recentDrops.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex 
                      ? 'bg-brand-green scale-125' 
                      : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Stats Footer - Only show when expanded */}
          {isExpanded && (
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/20">
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>1,247 active users</span>
                </div>
                <div className="flex items-center gap-1">
                  <Gift className="w-3 h-3" />
                  <span>₹2.4L raised today</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-green-600 font-medium">Live</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecentDropsTicker; 