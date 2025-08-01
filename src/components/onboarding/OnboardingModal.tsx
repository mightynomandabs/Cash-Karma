import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { X } from "lucide-react";
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

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent 
        className={cn(
          "glass border-border/20 max-w-md w-full p-8",
          "animate-scale-in"
        )}
      >
        <DialogTitle className="sr-only">Cash Karma Onboarding</DialogTitle>
        {/* Custom Close Button */}
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="absolute right-4 top-4 w-8 h-8 p-0 opacity-50 hover:opacity-100 transition-opacity"
        >
          <X className="w-4 h-4" />
        </Button>

        {/* Step Indicator */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === "login" ? "bg-primary" : "bg-muted"
            )} />
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === "avatar" ? "bg-primary" : "bg-muted"
            )} />
            <div className={cn(
              "w-2 h-2 rounded-full transition-colors",
              step === "complete" ? "bg-primary" : "bg-muted"
            )} />
          </div>
        </div>

        {/* Content */}
        <div className="transition-all duration-300">
          {step === "login" && (
            <div>
              {/* Progress Indicator */}
              <div className="text-center mb-6">
                <span className="text-sm text-muted-foreground font-medium tracking-wide">
                  step 1/3
                </span>
              </div>
              <LoginStep 
                onNext={handleLoginNext}
                onClose={handleClose}
              />
            </div>
          )}
          
          {step === "avatar" && user && (
            <AvatarStep 
              onComplete={handleAvatarComplete}
              onSkip={handleAvatarSkip}
            />
          )}
          
          {step === "complete" && (
            <div className="text-center space-y-8">
              {/* Success Animation with Confetti */}
              <div className="relative">
                <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-8">
                  <div className="text-4xl">🎉</div>
                </div>
                {/* Confetti Effect */}
                <div className="absolute inset-0 pointer-events-none">
                  {[...Array(15)].map((_, i) => (
                    <div
                      key={i}
                      className={cn(
                        "absolute w-2 h-2 rounded-full animate-bounce",
                        i % 4 === 0 ? "bg-primary" : i % 4 === 1 ? "bg-accent" : i % 4 === 2 ? "bg-neon-purple" : "bg-brand-yellow"
                      )}
                      style={{
                        left: `${10 + (i * 6)}%`,
                        top: `${20 + (i % 3) * 20}%`,
                        animationDelay: `${i * 150}ms`,
                        animationDuration: "2s"
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-3xl font-bold">welcome to cash karma!</h3>
                <p className="text-lg text-muted-foreground">
                  you're now part of the club. let's spread some karma!
                </p>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OnboardingModal;