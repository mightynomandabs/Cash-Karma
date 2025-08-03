import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Crown, Zap, Heart, Sparkles, Users, Gift, Target } from "lucide-react";
import ConfettiAnimation from "./ConfettiAnimation";

interface PremiumCTAProps {
  variant?: "hero" | "section" | "floating";
  title?: string;
  subtitle?: string;
  buttonText?: string;
  showStats?: boolean;
  showTrustIndicators?: boolean;
  onAction?: () => void;
}

const PremiumCTA = ({
  variant = "section",
  title = "Ready to Join the Karma Revolution?",
  subtitle = "Join thousands of legends who are already creating positive change through micro-acts of kindness",
  buttonText = "Become a Legend",
  showStats = true,
  showTrustIndicators = true,
  onAction
}: PremiumCTAProps) => {
  const [showConfetti, setShowConfetti] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);

  const handleAction = async () => {
    setIsLoading(true);
    setShowConfetti(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsLoading(false);
    // Hide confetti after animation
    setTimeout(() => setShowConfetti(false), 3000);
    
    onAction?.();
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };



  return (
    <>
      {showConfetti && <ConfettiAnimation />}
      
      <div className="relative max-w-6xl mx-auto">

        
        {/* Main CTA Card */}
        <div className="relative bg-gradient-to-br from-background/95 via-background/90 to-background/95 backdrop-blur-xl border border-border/50 rounded-3xl p-12 md:p-16 shadow-2xl">

          
          {/* Header with animated icons */}
          <div className="flex justify-center items-center gap-4 mb-8">
            <Heart className="w-8 h-8 text-brand-pink animate-pulse" />
            <div className="text-center">
              <h3 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent mb-2">
                {title}
              </h3>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                {subtitle}
              </p>
            </div>
            <Heart className="w-8 h-8 text-brand-pink animate-pulse delay-300" />
          </div>

          {/* Stats row */}
          {showStats && (
            <div className="flex flex-wrap justify-center items-center gap-6 md:gap-8 mb-10 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-brand-green" />
                <span>99,000+ Members</span>
              </div>
              <div className="flex items-center gap-2">
                <Gift className="w-4 h-4 text-brand-pink" />
                <span>₹24.7L+ Raised</span>
              </div>
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-brand-yellow" />
                <span>Instant Impact</span>
              </div>
            </div>
          )}

          {/* Enhanced CTA Button */}
          <div className="relative">
            {/* Button glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink rounded-full blur-xl opacity-50 animate-pulse"></div>
            
            <Button 
              onClick={handleAction}
              disabled={isLoading}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              variant="legend"
              size="legend"
              className="relative"
            >
              {/* Animated background */}
              <div className="absolute inset-0 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
              
              {/* Sparkle effects */}
              <div className="absolute inset-0 overflow-hidden rounded-full">
                <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-ping" />
                <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-100" />
                <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full animate-ping delay-200" />
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center gap-3">
                  <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="font-semibold">Creating Your Magic Link...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center gap-4 relative z-10">
                  <Crown className="w-7 h-7 animate-pulse" />
                  <span className="text-2xl font-bold">{buttonText}</span>
                  <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                </div>
              )}
            </Button>
          </div>

          {/* Trust indicators */}
          {showTrustIndicators && (
            <div className="flex flex-wrap justify-center items-center gap-4 md:gap-6 mt-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>100% Secure</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <span>Instant Setup</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <span>No Hidden Fees</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default PremiumCTA; 