import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { X, Cookie, Shield, Settings } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface CookieBannerProps {
  onAccept?: () => void;
  onDecline?: () => void;
}

const CookieBanner: React.FC<CookieBannerProps> = ({ 
  onAccept, 
  onDecline 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookie-consent');
    if (!cookieChoice) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
    onAccept?.();
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
    onDecline?.();
  };

  if (!isVisible) return null;

  return (
    <div 
      data-testid="cookie-banner"
      className="fixed bottom-0 left-0 right-0 z-50 p-4 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t"
    >
      <Card className="max-w-4xl mx-auto">
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <Cookie className="w-5 h-5 text-primary" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-sm mb-1">
                    We use cookies to enhance your experience
                  </h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    We use essential cookies to make our site work and analytics cookies to understand how you use our site. 
                    {!isExpanded && (
                      <button
                        onClick={() => setIsExpanded(true)}
                        className="text-primary hover:underline ml-1"
                      >
                        Learn more
                      </button>
                    )}
                  </p>
                  
                  {isExpanded && (
                    <div className="space-y-3 text-sm text-muted-foreground mb-4">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-green-500" />
                        <span><strong>Essential cookies:</strong> Required for basic site functionality</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-blue-500" />
                        <span><strong>Analytics cookies:</strong> Help us improve by understanding usage patterns</span>
                      </div>
                      <p className="text-xs">
                        By continuing to use our site, you agree to our use of cookies. 
                        You can change your preferences at any time.
                      </p>
                    </div>
                  )}
                  
                  <div className="flex flex-wrap gap-2">
                    <Button 
                      size="sm" 
                      onClick={handleAccept}
                      className="bg-primary hover:bg-primary/90"
                    >
                      Accept All
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleDecline}
                    >
                      Decline
                    </Button>
                    {isExpanded && (
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => setIsExpanded(false)}
                      >
                        Show Less
                      </Button>
                    )}
                  </div>
                </div>
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsVisible(false)}
                  className="flex-shrink-0 h-8 w-8 p-0"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CookieBanner; 