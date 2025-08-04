import React, { useState } from 'react';
import { Bell, Settings, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import cashKarmaLogo from '@/assets/Cash Karma.png';

interface Notification {
  id: number;
  type: 'streak' | 'levelup' | 'received';
  message: string;
  time: string;
  unread: boolean;
}

const NotificationBell = () => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications] = useState<Notification[]>([
    { id: 1, type: 'streak', message: '🔥 7-day streak! Keep it up!', time: '2 mins ago', unread: true },
    { id: 2, type: 'received', message: '💰 You received ₹50 from Priya S', time: '5 mins ago', unread: true },
    { id: 3, type: 'levelup', message: '⭐ Level up! You\'re now Level 5', time: '1 hour ago', unread: false },
  ]);

  const markAsRead = (id: number) => {
    // In a real app, this would update the notification status
    console.log('Marked as read:', id);
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'streak': return '🔥';
      case 'levelup': return '⭐';
      case 'received': return '💰';
      default: return '📢';
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'streak': return 'text-brand-yellow';
      case 'levelup': return 'text-brand-green';
      case 'received': return 'text-brand-pink';
      default: return 'text-muted-foreground';
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        className="relative p-2 text-muted-foreground hover:text-foreground transition-colors"
        title="Notifications (F8)"
      >
        <Bell className="w-6 h-6" />
        {notifications.filter(n => n.unread).length > 0 && (
          <span className="absolute -top-1 -right-1 bg-brand-pink text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
            {notifications.filter(n => n.unread).length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div className="absolute right-0 mt-2 w-80 bg-card rounded-lg shadow-lg border border-border z-50">
          <div className="p-4 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Notifications</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-border last:border-b-0 hover:bg-muted/50 transition-colors cursor-pointer ${
                  notification.unread ? 'bg-muted/20' : ''
                }`}
                onClick={() => markAsRead(notification.id)}
              >
                <div className="flex items-start space-x-3">
                  <div className={`text-lg ${getNotificationColor(notification.type)}`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-foreground">{notification.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{notification.time}</p>
                  </div>
                  {notification.unread && (
                    <div className="w-2 h-2 bg-brand-green rounded-full"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const UserAvatar = () => {
  const { user, signOut } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);

  // Debug logging
  console.log('UserAvatar - User data:', user);
  console.log('UserAvatar - User metadata:', user?.user_metadata);

  const handleSignOut = async () => {
    await signOut();
    window.location.href = '/';
  };

  const getUserDisplayName = () => {
    return user?.user_metadata?.display_name || 
           user?.email?.split('@')[0] || 
           'User';
  };

  const getUserAvatar = () => {
    return user?.user_metadata?.avatar_url || 
           `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'default'}`;
  };

  // Ensure we always have a fallback
  if (!user) {
    return (
      <div className="flex items-center space-x-2 p-2 rounded-lg bg-background/50">
        <Avatar className="w-8 h-8 border-2 border-primary/20">
          <AvatarFallback className="bg-gradient-to-r from-brand-green to-brand-yellow text-white font-semibold">
            ?
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          Loading...
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 p-2 rounded-lg hover:bg-muted/50 transition-colors bg-background/50"
      >
        <Avatar className="w-8 h-8 border-2 border-primary/20 shadow-lg">
          <AvatarImage src={getUserAvatar()} alt="User avatar" />
          <AvatarFallback className="bg-gradient-to-r from-brand-green to-brand-yellow text-white font-semibold shadow-inner">
            {getUserDisplayName().charAt(0)}
          </AvatarFallback>
        </Avatar>
        <span className="hidden sm:block text-sm font-medium text-foreground">
          {getUserDisplayName()}
        </span>
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-card rounded-lg shadow-lg border border-border z-50">
          <div className="p-3 border-b border-border">
            <p className="text-sm font-medium text-foreground">{getUserDisplayName()}</p>
            <p className="text-xs text-muted-foreground">{user?.email}</p>
          </div>
          <div className="p-1">
            <button
              onClick={() => setShowDropdown(false)}
              className="w-full flex items-center px-3 py-2 text-sm text-muted-foreground hover:bg-muted/50 rounded-md transition-colors"
            >
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </button>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded-md transition-colors"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const Navigation = () => {
  return (
    <nav className="fixed top-0 left-0 right-0 z-[9999] bg-background/90 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-14 sm:h-16">
          <div className="flex items-center space-x-3">
            {/* Logo */}
            <div className="flex items-center justify-center w-10 h-10">
              <img 
                src={cashKarmaLogo} 
                alt="Cash Karma Logo" 
                className="w-full h-full object-contain"
              />
            </div>
            {/* Brand Name */}
            <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent">
              Cash Karma
            </h1>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4">
            <NotificationBell />
            <UserAvatar />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navigation; 