import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChevronLeft, ChevronRight, Dice1, ArrowRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";

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
  { name: "Robot", src: robotAvatar },
  { name: "Cat", src: catAvatar },
  { name: "Unicorn", src: unicornAvatar },
  { name: "Astronaut", src: astronautAvatar },
  { name: "Panda", src: pandaAvatar },
  { name: "Fox", src: foxAvatar },
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

  return (
    <div className="space-y-8">
      {/* Progress Indicator */}
      <div className="text-center mb-6">
        <span className="text-sm text-muted-foreground font-medium tracking-wide">
          step 2/3
        </span>
      </div>

      {/* Header */}
      <div className="text-center space-y-4">
        <h2 className="text-3xl font-bold lowercase tracking-tight">
          choose your vibe
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          pick an avatar and display name. you can always change these later.
        </p>
      </div>

      {/* Avatar Carousel */}
      <div className="space-y-6">
        <div className="relative flex items-center justify-center">
          {/* Previous Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={prevAvatar}
            className="absolute left-0 z-10 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted"
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Avatar Display */}
          <div className="flex items-center gap-4 overflow-hidden">
            {AVATARS.map((avatar, index) => {
              const offset = index - selectedAvatar;
              const isSelected = index === selectedAvatar;
              
              return (
                <div
                  key={index}
                  className={`transition-all duration-300 flex-shrink-0 ${
                    isSelected 
                      ? 'scale-100 opacity-100 z-10' 
                      : Math.abs(offset) === 1 
                        ? 'scale-75 opacity-50' 
                        : 'scale-50 opacity-20'
                  }`}
                  style={{
                    transform: `translateX(${offset * -120}px) scale(${
                      isSelected ? 1 : Math.abs(offset) === 1 ? 0.75 : 0.5
                    })`,
                  }}
                >
                  <div 
                    className={`w-24 h-24 rounded-full overflow-hidden cursor-pointer transition-all duration-200 ${
                      isSelected 
                        ? 'ring-4 ring-primary shadow-glow' 
                        : 'hover:ring-2 hover:ring-primary/50'
                    }`}
                    onClick={() => setSelectedAvatar(index)}
                  >
                    <img 
                      src={avatar.src} 
                      alt={avatar.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Next Button */}
          <Button
            variant="ghost"
            size="sm"
            onClick={nextAvatar}
            className="absolute right-0 z-10 w-10 h-10 rounded-full bg-muted/50 hover:bg-muted"
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        {/* Roll Button */}
        <div className="text-center">
          <Button
            variant="outline"
            onClick={handleRollForMe}
            className="btn-pill group"
          >
            <Dice1 className="w-4 h-4 mr-2 group-hover:rotate-180 transition-transform duration-300" />
            roll for me!
          </Button>
        </div>
      </div>

      {/* Display Name */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-muted-foreground">
          display name
        </label>
        <Input
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
          className="h-12 bg-input/50 border-border/30 focus:border-primary/50 focus:ring-primary/20"
          placeholder="Enter your display name"
        />
      </div>

      {/* Actions */}
      <div className="space-y-4">
        <Button
          onClick={handleComplete}
          disabled={!displayName.trim() || loading}
          className="w-full h-12 btn-neon group"
        >
          {loading ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>setting up...</span>
            </div>
          ) : (
            <>
              let's go!
              <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>

        <Button
          variant="ghost"
          onClick={onSkip}
          className="w-full btn-pill"
        >
          skip for now
        </Button>
      </div>
    </div>
  );
};

export default AvatarStep;