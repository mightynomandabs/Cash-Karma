import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import LoginStep from "./MagicLinkStep";
import AvatarStep from "./AvatarStep";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type OnboardingStep = "login" | "avatar" | "complete";

const OnboardingModal = ({ isOpen, onClose }: OnboardingModalProps) => {
  const [step, setStep] = useState<OnboardingStep>("login");
  const { user } = useAuth();

  // Auto-advance to avatar step when user logs in
  useEffect(() => {
    if (user && step === "login") {
      setStep("avatar");
    }
  }, [user, step]);

  const handleLoginNext = () => {
    setStep("avatar");
  };

  const handleAvatarComplete = () => {
    setStep("complete");
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
    }, 2000);
  };

  const handleAvatarSkip = () => {
    setStep("complete");
    // Close modal after a brief delay
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  const resetModal = () => {
    setStep("login");
  };

  const handleClose = () => {
    resetModal();
    onClose();
  };

  const getStepNumber = () => {
    switch (step) {
      case "login":
        return 1;
      case "avatar":
        return 2;
      case "complete":
        return 3;
      default:
        return 1;
    }
  };

  const getStepTitle = () => {
    switch (step) {
      case "login":
        return "Join the Movement";
      case "avatar":
        return "Choose Your Vibe";
      case "complete":
        return "Welcome to Cash Karma!";
      default:
        return "Join the Movement";
    }
  };

  const getStepDescription = () => {
    switch (step) {
      case "login":
        return "Start your karma journey with secure, instant access";
      case "avatar":
        return "Personalize your profile with a unique avatar and name";
      case "complete":
        return "You're now part of the club. Let's spread some karma!";
      default:
        return "Start your karma journey with secure, instant access";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "fixed left-[50%] top-[50%] z-50 w-full max-w-md translate-x-[-50%] translate-y-[-50%]",
          "bg-gradient-to-br from-card/95 via-card/90 to-card/95 backdrop-blur-xl",
          "border border-border/20 rounded-2xl shadow-2xl",
          "p-0 overflow-hidden",
          "data-[state=open]:animate-in data-[state=closed]:animate-out",
          "data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0",
          "data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95",
          "data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]",
          "data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]"
        )}
      >
        {/* Custom Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-4 top-4 z-10 w-8 h-8 p-0 rounded-full bg-background/20 backdrop-blur-sm border border-border/20 opacity-70 hover:opacity-100 hover:bg-background/30 transition-all duration-200"
          aria-label="Close modal"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Header with Logo and Branding */}
        <div className="relative p-8 pb-6">
          {/* Background Pattern */}
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 rounded-t-2xl" />
          
          {/* Logo and Branding */}
          <div className="relative text-center space-y-4">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl border border-primary/20 backdrop-blur-sm">
              <Sparkles className="w-8 h-8 text-primary" />
            </div>
            
            <div className="space-y-2">
              <h1 className="text-2xl font-bold text-foreground">
                {getStepTitle()}
              </h1>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {getStepDescription()}
              </p>
            </div>
          </div>

          {/* Step Progress Indicator */}
          <div className="flex justify-center mt-6">
            <div className="flex items-center gap-2">
              {[1, 2, 3].map((stepNumber) => (
                <div
                  key={stepNumber}
                  className={cn(
                    "w-2.5 h-2.5 rounded-full transition-all duration-300",
                    getStepNumber() >= stepNumber 
                      ? "bg-gradient-to-r from-primary to-accent shadow-glow" 
                      : "bg-muted/50"
                  )}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 pb-8">
          <div className="transition-all duration-300">
            {step === "login" && (
              <LoginStep 
                onNext={handleLoginNext}
                onClose={handleClose}
              />
            )}
            
            {step === "avatar" && user && (
              <AvatarStep 
                onComplete={handleAvatarComplete}
                onSkip={handleAvatarSkip}
              />
            )}
            
            {step === "complete" && (
              <div className="text-center space-y-8">
                {/* Success Animation */}
                <div className="relative">
                  <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/20 backdrop-blur-sm">
                    <div className="text-3xl animate-bounce">🎉</div>
                  </div>
                  
                  {/* Animated Sparkles */}
                  <div className="absolute inset-0 pointer-events-none">
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={cn(
                          "absolute w-1.5 h-1.5 rounded-full animate-pulse",
                          i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-secondary"
                        )}
                        style={{
                          left: `${15 + (i * 10)}%`,
                          top: `${10 + (i % 2) * 30}%`,
                          animationDelay: `${i * 200}ms`,
                          animationDuration: "2s"
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xl font-bold text-foreground">
                    Welcome to Cash Karma!
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    You're now part of the club. Let's spread some karma!
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;