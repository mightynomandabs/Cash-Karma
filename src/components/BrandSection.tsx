import { useState, useEffect, useRef } from "react";
import { Heart, Shield, Users, Quote, Sparkles } from "lucide-react";
import AnimatedSection from "./AnimatedSection";

const BrandSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);

  // Intersection Observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.1 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const storyCards = [
    {
      icon: Heart,
      title: "Random Acts of Kindness",
      description: "We believe in the power of micro-giving. Small amounts create big impact when we all play together.",
      accent: "from-primary-gold/20 to-primary-gold/30",
      borderColor: "border-primary-gold/30",
      iconColor: "text-primary-gold",
      bgGradient: "from-surface-cream to-surface-white",
      delay: 200
    },
    {
      icon: Shield,
      title: "Secure by Design",
      description: "Bank-grade encryption, transparent transactions, and trusted payment processors. Your security is our priority.",
      accent: "from-accent-purple/20 to-accent-purple/30",
      borderColor: "border-accent-purple/30",
      iconColor: "text-accent-purple",
      bgGradient: "from-surface-cream to-surface-white",
      delay: 400
    },
    {
      icon: Users,
      title: "Community Over Competition",
      description: "Build genuine connections through giving. Earn badges for consistency, not for recruiting others.",
      accent: "from-primary-gold/20 to-accent-purple/30",
      borderColor: "border-primary-gold/30",
      iconColor: "text-primary-gold",
      bgGradient: "from-surface-cream to-surface-white",
      delay: 600
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden bg-surface-gray-50">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-gray-50 via-surface-white to-surface-cream" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-gold/5 to-accent-purple/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent-purple/5 to-primary-gold/5 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8 lowercase tracking-tight text-text-primary hover:scale-105 transition-transform duration-700">
              our story
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-primary-gold to-accent-purple mx-auto rounded-full shadow-soft" />
            <p className="text-xl text-text-secondary mt-8 max-w-4xl mx-auto leading-relaxed">
              Built on trust, powered by community, secured by technology. Cash Karma isn't just another app - it's a movement for those who dare to give first.
            </p>
          </div>
        </div>
        
        {/* Premium Card Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
          {storyCards.map((card, index) => (
            <div
              key={index}
              className={`transition-all duration-1000 ease-out delay-${card.delay} ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div
                className={`group relative h-full bg-gradient-to-br ${card.bgGradient} backdrop-blur-xl border ${card.borderColor} rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-500 cursor-pointer overflow-hidden`}
                onMouseEnter={() => setHoveredCard(index)}
                onMouseLeave={() => setHoveredCard(null)}
                style={{
                  transform: hoveredCard === index ? 'translateY(-12px) scale(1.02)' : 'translateY(0) scale(1)',
                }}
              >
                {/* Glassmorphism Effect */}
                <div className="absolute inset-0 bg-surface-white/5 backdrop-blur-sm rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-surface-white/10 to-transparent rounded-3xl" />
                
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-primary-gold/20 to-accent-purple/20 rounded-full blur-xl animate-pulse-soft" />
                  <div className="absolute bottom-4 left-4 w-12 h-12 bg-gradient-to-br from-accent-purple/20 to-primary-gold/20 rounded-full blur-xl animate-pulse-soft delay-1000" />
                </div>
                
                {/* Icon Container with Enhanced Design */}
                <div className={`relative z-10 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br ${card.accent} mb-8 group-hover:scale-110 transition-all duration-500 shadow-soft`}>
                  <card.icon className={`w-10 h-10 ${card.iconColor} transition-all duration-300 ${
                    hoveredCard === index ? 'animate-bounce' : ''
                  }`} />
                  
                  {/* Icon Glow Effect */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${card.accent} rounded-2xl blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                </div>
                
                {/* Content */}
                <div className="relative z-10">
                  <h3 className="text-2xl font-bold mb-4 lowercase tracking-tight text-text-primary group-hover:text-text-primary transition-colors duration-300">
                    {card.title}
                  </h3>
                  
                  <p className="text-lg text-text-secondary leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                    {card.description}
                  </p>
                </div>
                
                {/* Hover Effects */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-primary-gold/5 via-accent-purple/5 to-primary-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                {/* Particle Effects on Hover */}
                {hoveredCard === index && (
                  <div className="absolute inset-0 rounded-3xl overflow-hidden">
                    <div className="absolute top-2 right-2 w-2 h-2 bg-primary-gold/60 rounded-full animate-ping" />
                    <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-accent-purple/60 rounded-full animate-ping delay-200" />
                    <div className="absolute top-1/2 right-4 w-1 h-1 bg-primary-gold/60 rounded-full animate-ping delay-400" />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Quote Card */}
        <div className={`transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="relative max-w-4xl mx-auto">
            <div className="relative bg-gradient-to-br from-surface-cream via-surface-white to-surface-cream backdrop-blur-xl border border-primary-gold/30 rounded-3xl p-12 shadow-card hover:shadow-lg transition-all duration-500 group">
              {/* Glassmorphism Layers */}
              <div className="absolute inset-0 bg-surface-white/5 backdrop-blur-sm rounded-3xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-surface-white/10 to-transparent rounded-3xl" />
              
              {/* Decorative Elements */}
              <div className="absolute top-6 left-6 w-16 h-16 bg-gradient-to-br from-primary-gold/20 to-accent-purple/20 rounded-full blur-xl animate-pulse-soft" />
              <div className="absolute bottom-6 right-6 w-12 h-12 bg-gradient-to-br from-accent-purple/20 to-primary-gold/20 rounded-full blur-xl animate-pulse-soft delay-1000" />
              
              <div className="relative z-10 text-center">
                <Quote className="w-12 h-12 text-primary-gold mb-6 mx-auto group-hover:scale-110 transition-transform duration-500" />
                <blockquote className="text-3xl md:text-4xl font-medium italic leading-relaxed text-text-primary group-hover:text-text-primary transition-colors duration-300">
                  "every drop of karma creates ripples across the universe"
                </blockquote>
                
                {/* Enhanced Badge */}
                <div className="mt-8 inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-primary-gold/20 to-accent-purple/20 backdrop-blur-sm border border-primary-gold/30 rounded-full shadow-soft group-hover:shadow-lg transition-all duration-300">
                  <div className="w-2 h-2 bg-primary-gold rounded-full animate-pulse" />
                  <span className="text-lg font-medium text-text-secondary group-hover:text-text-primary transition-colors duration-300">
                    building community, one drop at a time
                  </span>
                  <Sparkles className="w-5 h-5 text-primary-gold group-hover:animate-bounce transition-all duration-300" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BrandSection;