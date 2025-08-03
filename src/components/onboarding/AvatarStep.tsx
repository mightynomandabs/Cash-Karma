import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ChevronLeft, ChevronRight, Dice1, ArrowRight, Sparkles, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

// Import avatar images
import robotAvatar from "@/assets/avatars/robot.png";
import catAvatar from "@/assets/avatars/cat.png";
import unicornAvatar from "@/assets/avatars/unicorn.png";
import astronautAvatar from "@/assets/avatars/astronaut.png";
import pandaAvatar from "@/assets/avatars/panda.png";
import foxAvatar from "@/assets/avatars/fox.png";

interface AvatarStepProps {
  onComplete: () => void;
  onSkip: () => void;
}

const AVATARS = [
  { name: "Robot", src: robotAvatar, description: "Tech-savvy and analytical" },
  { name: "Cat", src: catAvatar, description: "Curious and independent" },
  { name: "Unicorn", src: unicornAvatar, description: "Magical and unique" },
  { name: "Astronaut", src: astronautAvatar, description: "Adventurous and bold" },
  { name: "Panda", src: pandaAvatar, description: "Peaceful and wise" },
  { name: "Fox", src: foxAvatar, description: "Clever and adaptable" },
];

const AvatarStep = ({ onComplete, onSkip }: AvatarStepProps) => {
  const [selectedAvatar, setSelectedAvatar] = useState(0);
  const [displayName, setDisplayName] = useState(`KarmaGiver_${Math.floor(Math.random() * 9999 + 1)}`);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const handleRollForMe = () => {
    const randomIndex = Math.floor(Math.random() * AVATARS.length);
    const randomName = `KarmaGiver_${Math.floor(Math.random() * 9999 + 1)}`;
    setSelectedAvatar(randomIndex);
    setDisplayName(randomName);
  };

  const handleComplete = async () => {
    if (!user) return;
    
    setLoading(true);
    
    // Update user profile
    const { error } = await supabase
      .from('profiles')
      .upsert({
        user_id: user.id,
        display_name: displayName,
        avatar_url: AVATARS[selectedAvatar].src,
      });

    if (error) {
      console.error('Error updating profile:', error);
    }
    
    setLoading(false);
    onComplete();
  };

  const nextAvatar = () => {
    setSelectedAvatar((prev) => (prev + 1) % AVATARS.length);
  };

  const prevAvatar = () => {
    setSelectedAvatar((prev) => (prev - 1 + AVATARS.length) % AVATARS.length);
  };

  const currentAvatar = AVATARS[selectedAvatar];

  return (
    <div className="space-y-6">
      {/* Avatar Selection */}
      <div className="space-y-4">
        <div className="text-center space-y-2">
          <h3 className="text-lg font-semibold text-foreground">
            Choose Your Avatar
          </h3>
          <p className="text-sm text-muted-foreground">
            Pick an avatar that represents your vibe
          </p>
        </div>

        {/* Avatar Carousel */}
        <div className="relative">
          {/* Navigation Buttons */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevAvatar}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 hover:bg-background/90 transition-all duration-200"
            aria-label="Previous avatar"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          <Button
            variant="ghost"
            size="sm"
            onClick={nextAvatar}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 z-10 w-10 h-10 rounded-full bg-background/80 backdrop-blur-sm border border-border/20 hover:bg-background/90 transition-all duration-200"
            aria-label="Next avatar"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>

          {/* Avatar Display */}
          <div className="flex items-center justify-center py-8">
            <div className="relative">
              {/* Main Avatar */}
              <div className="relative">
                <div 
                  className={cn(
                    "w-24 h-24 rounded-2xl overflow-hidden transition-all duration-300",
                    "border-4 border-primary/20 shadow-lg",
                    "hover:border-primary/40 hover:shadow-xl",
                    "transform hover:scale-105"
                  )}
                >
                  <img 
                    src={currentAvatar.src} 
                    alt={currentAvatar.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Selection Indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 text-primary-foreground" />
                </div>
              </div>

              {/* Avatar Info */}
              <div className="text-center mt-4 space-y-1">
                <h4 className="text-base font-semibold text-foreground">
                  {currentAvatar.name}
                </h4>
                <p className="text-xs text-muted-foreground">
                  {currentAvatar.description}
                </p>
              </div>
            </div>
          </div>

          {/* Avatar Dots */}
          <div className="flex justify-center gap-2 mt-4">
            {AVATARS.map((_, index) => (
              <button
                key={index}
                onClick={() => setSelectedAvatar(index)}
                className={cn(
                  "w-2 h-2 rounded-full transition-all duration-200",
                  index === selectedAvatar 
                    ? "bg-primary shadow-glow" 
                    : "bg-muted/50 hover:bg-muted"
                )}
                aria-label={`Select ${AVATARS[index].name} avatar`}
              />
            ))}
          </div>
        </div>

        {/* Random Selection Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleRollForMe}
            className="btn-pill group bg-background/50 border-border/30 hover:bg-background/80 transition-all duration-200"
          >
            <Dice1 className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            Roll for me!
          </Button>
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-3">
        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-sm font-medium text-foreground">
            Display Name
          </Label>
          <div className="relative">
            <Input
              id="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              className={cn(
                "h-12 text-base bg-background/50 border-border/30",
                "focus:border-primary/50 focus:ring-primary/20 focus:ring-2",
                "transition-all duration-200",
                "pl-11 pr-4"
              )}
              placeholder="Enter your display name"
              maxLength={20}
            />
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-xs text-muted-foreground">
            This is how other users will see you
          </p>
        </div>
      </div>

      {/* Actions */}
      <div className="space-y-3 pt-4">
        <Button
          onClick={handleComplete}
          disabled={!displayName.trim() || loading}
          className={cn(
            "w-full h-12 text-base font-semibold transition-all duration-200",
            "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
            "text-primary-foreground shadow-lg hover:shadow-xl",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "group"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>Setting up...</span>
            </div>
          ) : (
            <>
              Let's Go!
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          className="w-full h-11 text-sm text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-all duration-200"
        >
          Skip for now
        </Button>
      </div>

      {/* Help Text */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          You can always change your avatar and name later in your profile settings
        </p>
      </div>
    </div>
  );
};

export default AvatarStep;