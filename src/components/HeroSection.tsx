import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Sparkles, ArrowRight } from "lucide-react";
import OnboardingModal from "./onboarding/OnboardingModal";
import Logo from "@/components/ui/Logo";

const HeroSection = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  
  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-navy via-brand-navy/95 to-brand-navy/90" />
      <div className="absolute inset-0 bg-gradient-subtle opacity-80" />
      
      {/* Content */}
      <div className="relative z-10 text-center max-w-4xl mx-auto px-6">
        {/* Logo */}
        <div className="flex justify-center mb-16">
          <Logo size="lg" className="scale-125" />
        </div>

        {/* Exclusivity Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-card/20 backdrop-blur-sm border border-brand-pink/30 rounded-full mb-12">
          <Sparkles className="w-4 h-4 text-brand-pink" />
          <span className="text-accent text-sm font-medium tracking-wider uppercase text-brand-yellow">
            invitation only
          </span>
        </div>

        {/* Main Headline */}
        <h1 className="text-hero mb-12 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent">
          generosity, gamified
        </h1>

        {/* Subheading */}
        <p className="text-subhero text-muted-foreground mb-8 max-w-2xl mx-auto">
          cash karma. a social giving club for the bold, the kind, the curious.
        </p>

        {/* Accent Line */}
        <p className="text-accent text-primary/80 mb-16">
          not everyone gets in. only legends give karma.
        </p>

        {/* Primary CTA */}
        <div className="mb-8">
          <Button 
            onClick={() => setShowOnboarding(true)}
            className="btn-neon group px-12 py-6 text-xl font-bold"
          >
            Get Magic Link
            <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        {/* Secondary CTA */}
        <div className="mb-16">
          <Button variant="ghost" className="btn-pill text-lg">
            preview recent drops
          </Button>
        </div>

        {/* Live Ticker */}
        <div className="text-sm text-muted-foreground/70 tracking-wide">
          247,000 drops sent - 99,102 members strong
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-primary rounded-full animate-pulse-soft" />
      <div className="absolute top-1/3 right-1/3 w-1 h-1 bg-accent rounded-full animate-pulse-soft delay-1000" />
      <div className="absolute bottom-1/4 right-1/4 w-3 h-3 bg-neon-purple/30 rounded-full animate-pulse-soft delay-500" />

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </section>
  );
};

export default HeroSection;