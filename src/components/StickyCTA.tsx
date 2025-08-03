import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, X } from "lucide-react";
import OnboardingModal from "./onboarding/OnboardingModal";

const StickyCTA = () => {
  const [isVisible, setIsVisible] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);

  const handleGetMagicLink = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOnboarding(true);
  };

  if (!isVisible) {
    return null;
  }

  return (
    <>
      {/* Sticky CTA Bar */}
      <div className="fixed bottom-0 left-0 right-0 z-50 bg-primary-gold border-t border-primary-gold-dark shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Content */}
            <div className="flex items-center gap-4 flex-1">
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-text-primary animate-pulse" />
                <span className="text-sm font-medium text-text-primary">
                  Ready to join the karma revolution?
                </span>
              </div>
              
              <div className="flex items-center gap-2 sm:hidden">
                <Sparkles className="w-4 h-4 text-text-primary animate-pulse" />
                <span className="text-xs font-medium text-text-primary">
                  Join the revolution
                </span>
              </div>
            </div>

            {/* CTA Button */}
            <div className="flex items-center gap-3">
              <Button
                onClick={handleGetMagicLink}
                disabled={isLoading}
                className="bg-text-primary hover:bg-text-primary/90 text-primary-gold px-6 py-2 text-sm font-semibold rounded-full transition-all duration-300 transform hover:scale-105 shadow-soft"
              >
                <div className="flex items-center gap-2">
                  <span>Get Magic Link</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </Button>

              {/* Dismiss Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsVisible(false)}
                className="p-1 h-8 w-8 text-text-primary hover:text-text-primary/80 hover:bg-text-primary/10 rounded-full transition-all duration-300"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Add bottom padding to account for sticky CTA */}
      <div className="pb-20" />

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </>
  );
};

export default StickyCTA; 