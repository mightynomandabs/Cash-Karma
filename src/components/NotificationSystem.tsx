import React, { useState, useEffect } from 'react';
import { X, Trophy, CheckCircle, BarChart3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface Notification {
  id: string;
  type: 'achievement' | 'success' | 'summary';
  title: string;
  message: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
}

const NotificationSystem: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'achievement',
      title: 'Karma Pioneer Badge Unlocked!',
      message: 'You\'ve earned the Karma Pioneer badge for your first 10 drops',
      icon: Trophy,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50',
      borderColor: 'border-yellow-200'
    },
    {
      id: '2',
      type: 'success',
      title: 'Drop Sent Successfully!',
      message: 'Your ₹50 drop has been sent to the community',
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    {
      id: '3',
      type: 'summary',
      title: 'Weekly Impact Summary',
      message: 'You\'ve created ₹250 in positive impact this week',
      icon: BarChart3,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  ]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Auto-advance notifications
  useEffect(() => {
    if (!isAutoPlaying || notifications.length <= 1) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % notifications.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, notifications.length]);

  const handleDismiss = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    if (notifications.length === 1) {
      setIsVisible(false);
    }
  };

  const handlePrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + notifications.length) % notifications.length);
  };

  const handleNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % notifications.length);
  };

  const handleDismissAll = () => {
    setIsVisible(false);
  };

  if (!isVisible || notifications.length === 0) {
    return <>{children}</>;
  }

  const currentNotification = notifications[currentIndex];

  return (
    <>
      {/* Notification Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-xl border-b border-gray-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Notification Content */}
            <div className="flex items-center flex-1 min-w-0">
              <div className={`flex items-center gap-3 p-3 rounded-lg border ${currentNotification.bgColor} ${currentNotification.borderColor} flex-1`}>
                <div className={`p-2 rounded-full ${currentNotification.bgColor}`}>
                  <currentNotification.icon className={`w-5 h-5 ${currentNotification.color}`} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className={`font-semibold text-sm ${currentNotification.color}`}>
                      {currentNotification.title}
                    </h4>
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${currentNotification.color} ${currentNotification.bgColor} ${currentNotification.borderColor}`}
                    >
                      {currentNotification.type}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 truncate">
                    {currentNotification.message}
                  </p>
                </div>
              </div>
            </div>

            {/* Navigation Controls */}
            {notifications.length > 1 && (
              <div className="flex items-center gap-2 ml-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handlePrevious}
                  className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex gap-1">
                  {notifications.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setIsAutoPlaying(false);
                        setCurrentIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full transition-colors ${
                        index === currentIndex 
                          ? currentNotification.color.replace('text-', 'bg-') 
                          : 'bg-gray-300'
                      }`}
                    />
                  ))}
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleNext}
                  className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}

            {/* Dismiss Button */}
            <div className="flex items-center gap-2 ml-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDismiss(currentNotification.id)}
                className="p-1 h-8 w-8 text-gray-500 hover:text-gray-700"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add top padding to account for fixed notification bar */}
      <div className="pt-16">
        {children}
      </div>
    </>
  );
};

export default NotificationSystem; 