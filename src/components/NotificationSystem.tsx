import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Bell, Gift, Sparkles } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Notification {
  id: string;
  type: 'drop_received' | 'match_complete' | 'payout_confirmed';
  title: string;
  message: string;
  amount?: number;
  sender_name?: string;
  created_at: string;
  read: boolean;
}

interface NotificationSystemProps {
  children: React.ReactNode;
}

const NotificationSystem = ({ children }: NotificationSystemProps) => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showBanner, setShowBanner] = useState(false);
  const [currentNotification, setCurrentNotification] = useState<Notification | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);

  // Request notification permission
  useEffect(() => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  }, []);

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user) return;

    try {
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (data) {
        setNotifications(data);
        setUnreadCount(data.filter((n: Notification) => !n.read).length);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  // Show push notification
  const showPushNotification = (notification: Notification) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        tag: notification.id,
        requireInteraction: true,
      });
    }
  };

  // Show in-app banner
  const showInAppBanner = (notification: Notification) => {
    setCurrentNotification(notification);
    setShowBanner(true);
    
    // Auto-hide after 5 seconds
    setTimeout(() => {
      setShowBanner(false);
      setCurrentNotification(null);
    }, 5000);
  };

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
    try {
      await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);
      
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  // Handle new drop received
  const handleDropReceived = (drop: any) => {
    const notification: Notification = {
      id: `drop_${drop.id}`,
      type: 'drop_received',
      title: '🎉 You received karma!',
      message: `${drop.sender?.display_name || 'Someone'} sent you ₹${drop.amount}`,
      amount: drop.amount,
      sender_name: drop.sender?.display_name,
      created_at: new Date().toISOString(),
      read: false
    };

    showPushNotification(notification);
    showInAppBanner(notification);
    toast.success(notification.title, {
      description: notification.message,
      duration: 4000,
    });
  };

  // Subscribe to real-time updates
  useEffect(() => {
    if (!user) return;

    fetchNotifications();

    const channel = supabase
      .channel('notifications')
      .on('postgres_changes', { 
        event: 'INSERT', 
        schema: 'public', 
        table: 'drops',
        filter: `recipient_id=eq.${user.id}`
      }, (payload) => {
        handleDropReceived(payload.new);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return (
    <>
      {/* Notification Banner */}
      {showBanner && currentNotification && (
        <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
          <Card className="w-80 bg-gradient-to-r from-brand-pink/20 to-brand-yellow/20 border-brand-pink/30 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-pink/20 rounded-full flex items-center justify-center">
                  <Gift className="w-5 h-5 text-brand-pink" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-sm mb-1">
                    {currentNotification.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mb-2">
                    {currentNotification.message}
                  </p>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      className="h-6 text-xs bg-brand-pink/20 text-brand-pink hover:bg-brand-pink/30"
                      onClick={() => markAsRead(currentNotification.id)}
                    >
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 text-xs"
                      onClick={() => setShowBanner(false)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-6 w-6 p-0"
                  onClick={() => setShowBanner(false)}
                >
                  <X className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Notification Indicator */}
      {unreadCount > 0 && (
        <div className="fixed top-4 right-4 z-40">
          <div className="relative">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
              {unreadCount > 9 ? '9+' : unreadCount}
            </span>
          </div>
        </div>
      )}

      {children}
    </>
  );
};

export default NotificationSystem; 