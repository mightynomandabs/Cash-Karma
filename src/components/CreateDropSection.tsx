import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Rocket, Smile, Heart } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { GamificationService, XP_REWARDS } from "@/lib/gamification";
import { LeaderboardService } from "@/lib/leaderboard";
import { mockPaymentService } from "@/lib/payment";

interface CreateDropSectionProps {
  onDropCreated: () => void;
}

const CreateDropSection = ({ onDropCreated }: CreateDropSectionProps) => {
  const { user } = useAuth();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [isFirstTimeUser, setIsFirstTimeUser] = useState(false);
  const [showIntroCard, setShowIntroCard] = useState(true);

  const amounts = [1, 5, 10, 50, 100];
  
  const autoSuggestions = [
    "Spread some cheer! ✨",
    "Here's a boost! 🚀",
    "Sending good vibes! 💫",
    "Because kindness rocks! 🌟",
    "Pay it forward! 🙏",
    "Making someone's day! ☀️",
    "Random acts of awesome! 🎉",
    "Kindness is contagious! 💜"
  ];

  // Fetch user profile and check if first-time user
  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) return;
      
      try {
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single();
        
        setUserProfile(profile);
        
        // Check if user has made any drops before
        const { data: drops } = await supabase
          .from('drops')
          .select('id')
          .eq('sender_id', user.id)
          .limit(1);
        
        setIsFirstTimeUser(!drops || drops.length === 0);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [user]);

  const getRandomSuggestion = () => {
    return autoSuggestions[Math.floor(Math.random() * autoSuggestions.length)];
  };

  const handleSubmit = async () => {
    if (!selectedAmount || !user) {
      console.error('Missing required data:', { selectedAmount, user });
      toast.error("Please select an amount to send karma");
      return;
    }

    setIsSubmitting(true);
    
    try {
      console.log('Starting karma drop creation...', { selectedAmount, user: user.id });
      
      const finalMessage = message.trim() || getRandomSuggestion();
      
      console.log('Using mock payment service for testing');

      console.log('Creating drop with payment service...');
      
      // Create drop and payment session using MockPaymentService
      const { drop, paymentSession } = await mockPaymentService.createDrop({
        amount: selectedAmount,
        message: finalMessage,
        display_name: userProfile?.display_name,
        avatar_url: userProfile?.avatar_url
      });

      console.log('Drop and payment session created:', { dropId: drop.id, sessionId: paymentSession.id });

      // Initiate mock payment
      console.log('Initiating mock payment...');
      await mockPaymentService.initiatePayment(drop, paymentSession);

      // Listen for payment result
      const handlePaymentSuccess = (event: CustomEvent) => {
        const { paymentId, orderId, amount } = event.detail;
        
        // Award XP for sending drop
        GamificationService.awardXP(user.id, XP_REWARDS.SEND_DROP, 'Sent karma drop');

        // Check if this is the first drop
        if (isFirstTimeUser) {
          GamificationService.awardXP(user.id, XP_REWARDS.FIRST_DROP, 'First karma drop');
          toast.success("🎉 First Drop Bonus!", {
            description: `+${XP_REWARDS.FIRST_DROP} XP for your first karma drop!`,
            duration: 4000,
          });
        }

        // Check for big drop bonus
        if (selectedAmount >= 100) {
          GamificationService.awardXP(user.id, 50, 'Big drop bonus');
          toast.success("💰 Big Drop Bonus!", {
            description: `+50 XP for sending ₹${selectedAmount}!`,
            duration: 3000,
          });
        }

        // Check achievements
        GamificationService.checkAchievements(user.id);

        // Update leaderboard
        LeaderboardService.updateUserLeaderboard(user.id);

        toast.success("Payment Successful! 🎉", {
          description: `₹${amount} sent successfully! Payment ID: ${paymentId}`,
          duration: 5000,
        });

        // Remove event listener
        window.removeEventListener('payment-success', handlePaymentSuccess);
        window.removeEventListener('payment-failed', handlePaymentFailure);
      };

      const handlePaymentFailure = (event: CustomEvent) => {
        const { error } = event.detail;
        toast.error("Payment Failed", {
          description: error || "Payment could not be processed",
          duration: 5000,
        });

        // Remove event listener
        window.removeEventListener('payment-success', handlePaymentSuccess);
        window.removeEventListener('payment-failed', handlePaymentFailure);
      };

      // Add event listeners
      window.addEventListener('payment-success', handlePaymentSuccess);
      window.addEventListener('payment-failed', handlePaymentFailure);

      toast.success("Payment Processing! 🎉", {
        description: `₹${selectedAmount} payment processing...`,
        duration: 3000,
      });

      // Reset form
      setSelectedAmount(null);
      setMessage("");
      setIsFirstTimeUser(false);
      
      // Notify parent component
      onDropCreated();

    } catch (error) {
      console.error('Error in karma drop creation:', error);
      
      // Provide specific error messages based on error type
      let errorMessage = "Failed to send karma. Please try again.";
      
      if (error instanceof Error) {
        if (error.message.includes('not authenticated')) {
          errorMessage = "Please log in to send karma.";
        } else if (error.message.includes('Razorpay')) {
          errorMessage = "Payment system error. Please try again.";
        } else if (error.message.includes('database')) {
          errorMessage = "Database error. Please try again.";
        } else {
          errorMessage = error.message;
        }
      }
      
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isReady = selectedAmount && user;
  const displayName = userProfile?.display_name || "Karma Giver";

  return (
    <div className="space-y-6">
      {/* First-time User Intro Card */}
      {isFirstTimeUser && showIntroCard && (
        <Card className="w-full max-w-2xl mx-auto bg-gradient-to-r from-brand-pink/20 to-brand-yellow/20 border-brand-pink/30">
          <CardContent className="p-6">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-brand-pink/20 rounded-full">
                <Heart className="w-6 h-6 text-brand-pink" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  Your first drop is on us!
                </h3>
                <p className="text-muted-foreground text-sm">
                  Try sending ₹5 now to experience the magic of Cash Karma
                </p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowIntroCard(false)}
                className="text-xs"
              >
                Got it!
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="w-full max-w-2xl mx-auto bg-card/20 backdrop-blur-sm border-border/30">
        <CardContent className="p-8">
          {/* Personalized Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-primary bg-clip-text text-transparent mb-2">
              Hey {displayName} 👋
            </h2>
            <p className="text-lg text-muted-foreground">
              Ready to drop some Karma?
            </p>
          </div>

          {/* Amount Picker */}
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {amounts.map((amount) => (
              <Button
                key={amount}
                variant="outline"
                size="lg"
                onClick={() => setSelectedAmount(amount)}
                className={`
                  h-14 px-8 rounded-full font-bold text-lg transition-all duration-300
                  ${selectedAmount === amount 
                    ? "bg-gradient-to-r from-brand-pink to-accent text-white shadow-lg scale-105 animate-pulse" 
                    : "hover:scale-105 hover:bg-accent/20 border-border/50"
                  }
                  ${selectedAmount === amount && "shadow-[0_0_20px_rgba(236,72,153,0.5)]"}
                `}
              >
                ₹{amount}
              </Button>
            ))}
          </div>

          {/* Message Input */}
          <div className="space-y-4 mb-8">
            <div className="relative">
              <Input
                placeholder="Add a message (optional) or we'll pick a good vibe for you..."
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 140))}
                className="h-14 text-lg bg-background/50 backdrop-blur-sm border-border/50 focus:border-primary/50 px-4"
                maxLength={140}
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                onClick={() => setMessage(getRandomSuggestion())}
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>
            <div className="flex justify-between items-center text-sm text-muted-foreground">
              <span>
                {!message.trim() && "We'll auto-complete with good vibes ✨"}
              </span>
              <span>{message.length}/140</span>
            </div>
          </div>

          {/* Send Button */}
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="w-full">
                  <Button
                    onClick={handleSubmit}
                    disabled={!isReady || isSubmitting}
                    className={`
                      w-full h-16 text-xl font-bold rounded-full transition-all duration-300
                      ${isReady && !isSubmitting
                        ? "bg-gradient-to-r from-brand-green to-brand-pink hover:shadow-lg animate-pulse" 
                        : "opacity-50 cursor-not-allowed"
                      }
                    `}
                  >
                    {isSubmitting ? (
                      <div className="flex items-center gap-3">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        <span>Sending Karma...</span>
                      </div>
                    ) : (
                      <>
                        Send Karma 🚀
                        <Rocket className="w-6 h-6 ml-3" />
                      </>
                    )}
                  </Button>
                </div>
              </TooltipTrigger>
              {!isReady && (
                <TooltipContent>
                  <p>Select an amount to send karma</p>
                </TooltipContent>
              )}
            </Tooltip>
          </TooltipProvider>

          {/* Subtext */}
          <div className="text-center mt-4">
            <p className="text-sm text-muted-foreground">
              It's instant, random, and joy guaranteed.
            </p>
          </div>

          {/* Mini Preview */}
          {isReady && (
            <div className="mt-6 p-4 bg-muted/20 rounded-lg border border-border/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">
                    Sending ₹{selectedAmount} with {message.trim() || "good vibes"}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Ready to spread some karma! +{XP_REWARDS.SEND_DROP} XP
                  </p>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CreateDropSection;