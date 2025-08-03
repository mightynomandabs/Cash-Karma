import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Gift, Sparkles, Crown } from "lucide-react";
import OnboardingModal from "./onboarding/OnboardingModal";
import AnimatedSection from "./AnimatedSection";

const HeroSection = () => {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [membersCount, setMembersCount] = useState(0);
  const [dropsCount, setDropsCount] = useState(0);
  const [isCounting, setIsCounting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const heroRef = useRef<HTMLElement>(null);

  // Intersection Observer for fade-in animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (!isCounting) {
            setIsCounting(true);
            animateCount(99012, setMembersCount, 2000);
            animateCount(247000, setDropsCount, 2500);
          }
        }
      },
      { threshold: 0.1 }
    );

    if (heroRef.current) {
      observer.observe(heroRef.current);
    }

    return () => observer.disconnect();
  }, [isCounting]);

  const animateCount = (target: number, setter: (value: number) => void, duration: number) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;

    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setter(target);
        clearInterval(timer);
      } else {
        setter(Math.floor(current));
      }
    }, 16);
  };

  const handleGetMagicLink = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOnboarding(true);
  };

  return (
    <section 
      ref={heroRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 sm:pt-36 bg-gradient-to-br from-surface-cream via-surface-white to-surface-gray-50"
    >
      {/* Warm Background with Subtle Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-cream via-surface-white to-surface-gray-50" />
      
      {/* Subtle Animated Background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Warm floating elements */}
        <div className="absolute top-1/4 left-1/4 w-32 h-32 opacity-10 animate-float-slow">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-accent-purple rounded-full animate-ping"></div>
        </div>
        
        <div className="absolute top-1/3 right-1/4 w-24 h-24 opacity-15 animate-float-medium">
          <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/40 to-transparent rounded-full animate-bounce"></div>
        </div>
        
        {/* Minimal particle effects */}
        <div className="absolute top-1/2 left-1/6 w-2 h-2 bg-primary-gold/40 rounded-full animate-pulse-soft animate-float-slow"></div>
        <div className="absolute top-1/3 right-1/6 w-1 h-1 bg-accent-purple/40 rounded-full animate-pulse-soft delay-1000 animate-float-medium"></div>
        <div className="absolute bottom-1/3 left-1/2 w-3 h-3 bg-primary-gold/40 rounded-full animate-pulse-soft delay-500 animate-float-fast"></div>
      </div>
      
      {/* Content with Clean Typography */}
      <div className="relative z-10 text-center max-w-6xl mx-auto px-6">
        {/* Invitation Only Badge */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="inline-flex items-center gap-2 mb-8">
            <Crown className="w-5 h-5 text-primary-gold" />
            <span className="bg-primary-gold text-text-primary px-4 py-2 rounded-full text-sm font-semibold shadow-soft">
              INVITATION ONLY
            </span>
          </div>
        </div>

        {/* Streamlined Headline */}
        <div className={`transition-all duration-1000 ease-out delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h1 className="text-6xl sm:text-7xl lg:text-8xl font-black mb-8 text-text-primary leading-[1.1] tracking-tight">
            generosity,
            <br className="hidden sm:block" /> 
            gamified
          </h1>
        </div>

        {/* Simplified Tagline */}
        <div className={`transition-all duration-1000 ease-out delay-400 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-12 max-w-3xl mx-auto">
            <p className="text-xl sm:text-2xl lg:text-3xl text-text-secondary leading-relaxed font-light">
              cash karma. a social giving club for the bold, the kind, the curious.
            </p>
          </div>
        </div>

        {/* Single Primary CTA */}
        <div className={`transition-all duration-1000 ease-out delay-600 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="mb-16">
            <Button 
              onClick={handleGetMagicLink}
              disabled={isLoading}
              className="relative group bg-primary-gold hover:bg-primary-gold-dark text-text-primary px-12 py-6 text-xl font-bold rounded-full transition-all duration-500 transform hover:scale-105 shadow-card hover:shadow-lg"
            >
              {/* Button glow effect */}
              <div className="absolute inset-0 bg-primary-gold rounded-full blur-xl opacity-50 animate-pulse"></div>
              
              <div className="flex items-center justify-center gap-4 relative z-10">
                <Sparkles className="w-6 h-6 animate-pulse" />
                <span>Get Magic Link</span>
                <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform duration-300" />
              </div>
            </Button>
          </div>
        </div>

        {/* Simplified Impact Stats */}
        <div className={`transition-all duration-1000 ease-out delay-800 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="flex flex-col sm:flex-row gap-8 justify-center items-center">
            <div className="flex items-center gap-4 px-6 py-3 bg-surface-cream border border-primary-gold/30 rounded-xl shadow-soft">
              <Gift className="w-5 h-5 text-primary-gold" />
              <div>
                <div className="text-xl font-bold text-primary-gold">
                  {dropsCount.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">drops sent</div>
              </div>
            </div>
            
            <div className="flex items-center gap-4 px-6 py-3 bg-surface-cream border border-accent-purple/30 rounded-xl shadow-soft">
              <Users className="w-5 h-5 text-accent-purple" />
              <div>
                <div className="text-xl font-bold text-accent-purple">
                  {membersCount.toLocaleString()}
                </div>
                <div className="text-sm text-text-secondary">members strong</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Onboarding Modal */}
      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />
    </section>
  );
};

export default HeroSection;