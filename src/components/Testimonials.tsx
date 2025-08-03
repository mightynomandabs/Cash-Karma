import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Star, Quote, Crown, Heart, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import OnboardingModal from "./onboarding/OnboardingModal";

// Import avatar images
import astronautAvatar from "@/assets/avatars/astronaut.png";
import catAvatar from "@/assets/avatars/cat.png";
import foxAvatar from "@/assets/avatars/fox.png";
import pandaAvatar from "@/assets/avatars/panda.png";
import robotAvatar from "@/assets/avatars/robot.png";
import unicornAvatar from "@/assets/avatars/unicorn.png";

const Testimonials = () => {
  const navigate = useNavigate();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const testimonials = [
    {
      id: 1,
      name: "Priya Sharma",
      role: "Early Adopter",
      avatar: astronautAvatar,
      content: "Cash Karma changed how I think about giving. It's not about the amount, it's about the intention. Every drop creates ripples of positive change that I can see in real-time.",
      rating: 5,
      location: "Mumbai, India",
      legendBadge: "Karma Pioneer",
      legendIcon: Crown
    },
    {
      id: 2,
      name: "Arjun Mehta",
      role: "Community Builder",
      avatar: robotAvatar,
      content: "The transparency is incredible. I can see exactly where my karma goes and the impact it creates. This is the future of giving - transparent, accountable, and meaningful.",
      rating: 5,
      location: "Bangalore, India",
      legendBadge: "Impact Leader",
      legendIcon: Crown
    },
    {
      id: 3,
      name: "Aisha Patel",
      role: "Karma Legend",
      avatar: unicornAvatar,
      content: "I love the gamification aspect. Earning badges for consistency rather than referrals makes it feel genuine and meaningful. It's about the journey, not the destination.",
      rating: 5,
      location: "Delhi, India",
      legendBadge: "Karma Legend",
      legendIcon: Crown
    },
    {
      id: 4,
      name: "Rahul Kumar",
      role: "Tech Enthusiast",
      avatar: foxAvatar,
      content: "The community aspect is what sets it apart. Strangers become family through small acts of kindness. It's beautiful to see how micro-amounts can create macro-impact.",
      rating: 5,
      location: "Pune, India",
      legendBadge: "Community Hero",
      legendIcon: Crown
    },
    {
      id: 5,
      name: "Zara Khan",
      role: "Social Impact Advocate",
      avatar: pandaAvatar,
      content: "Finally, a platform that makes giving feel good without the pressure. The micro-amounts approach is revolutionary. It's democratizing philanthropy.",
      rating: 5,
      location: "Chennai, India",
      legendBadge: "Impact Champion",
      legendIcon: Crown
    },
    {
      id: 6,
      name: "Vikram Singh",
      role: "Digital Nomad",
      avatar: catAvatar,
      content: "As someone who travels constantly, Cash Karma lets me stay connected to causes I care about. The global community aspect is truly inspiring.",
      rating: 5,
      location: "Remote, Global",
      legendBadge: "Global Karma",
      legendIcon: Crown
    }
  ];

  const displayedTestimonials = showAll ? testimonials : testimonials.slice(0, 3);

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % displayedTestimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + displayedTestimonials.length) % displayedTestimonials.length);
  };

  const handleGetMagicLink = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOnboarding(true);
  };

  return (
    <section className="py-24 px-6 bg-gradient-to-br from-surface-gray-50 via-surface-white to-surface-cream relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-primary-gold/10 to-accent-purple/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-accent-purple/10 to-primary-gold/10 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="inline-flex items-center gap-2 mb-4">
            <Crown className="w-6 h-6 text-primary-gold" />
            <Badge variant="secondary" className="bg-primary-gold/20 text-primary-gold border-primary-gold/30">
              Karma Legends
            </Badge>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold mb-8 text-text-primary leading-tight">
            what our legends say
          </h2>
          <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
            real stories from real people who've experienced the magic of cash karma
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div className="relative mb-12">
          {/* Navigation Arrows */}
          <button
            onClick={prevTestimonial}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-surface-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-300 shadow-soft hover:shadow-lg"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          
          <button
            onClick={nextTestimonial}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 w-12 h-12 bg-surface-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-all duration-300 shadow-soft hover:shadow-lg"
          >
            <ChevronRight className="w-6 h-6" />
          </button>

          {/* Testimonials Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {displayedTestimonials.map((testimonial, index) => (
              <Card 
                key={testimonial.id}
                className={`bg-gradient-to-br from-surface-white via-surface-cream to-surface-white backdrop-blur-xl border border-border/50 rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-500 hover:scale-[1.02] group ${
                  index === currentIndex ? 'ring-2 ring-primary-gold/30' : ''
                }`}
              >
                <CardContent className="p-0">
                  {/* Large Quote Marks */}
                  <div className="relative mb-6">
                    <div className="absolute -top-2 -left-2 text-4xl text-primary-gold/20 font-serif">
                      "
                    </div>
                    
                    {/* Legend Badge */}
                    <div className="flex justify-center mb-4">
                      <Badge className="bg-gradient-to-r from-primary-gold/20 to-accent-purple/20 text-primary-gold border-primary-gold/30 px-3 py-1 text-xs font-semibold">
                        {React.createElement(testimonial.legendIcon, { className: "w-3 h-3 mr-1" })}
                        {testimonial.legendBadge}
                      </Badge>
                    </div>
                  </div>

                  {/* Testimonial Content */}
                  <div className="text-center mb-6">
                    <p className="text-base text-text-secondary leading-relaxed italic mb-4 font-light">
                      "{testimonial.content}"
                    </p>
                    
                    {/* Rating */}
                    <div className="flex justify-center gap-1 mb-4">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 text-primary-gold fill-current" />
                      ))}
                    </div>
                  </div>

                  {/* User Info */}
                  <div className="flex items-center justify-center gap-4">
                    <div className="relative">
                      <div className="w-16 h-16 rounded-full overflow-hidden ring-4 ring-primary-gold/20 group-hover:ring-primary-gold/40 transition-all duration-300">
                        <img 
                          src={testimonial.avatar} 
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-gradient-to-r from-primary-gold to-accent-purple rounded-full flex items-center justify-center">
                        <Crown className="w-2.5 h-2.5 text-white" />
                      </div>
                    </div>
                    <div className="text-center">
                      <h4 className="font-bold text-text-primary text-base mb-1">{testimonial.name}</h4>
                      <p className="text-primary-gold font-medium text-sm mb-1">{testimonial.role}</p>
                      <p className="text-xs text-text-muted/70">{testimonial.location}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Carousel Indicators */}
          <div className="flex justify-center gap-2 mt-8">
            {displayedTestimonials.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentIndex 
                    ? 'bg-primary-gold' 
                    : 'bg-text-muted/30 hover:bg-text-muted/50'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Show More/Less Button */}
        {testimonials.length > 3 && (
          <div className="text-center mb-16">
            <Button 
              variant="outline"
              onClick={() => setShowAll(!showAll)}
              className="group bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 border-primary-gold/30 hover:border-primary-gold/50 text-primary-gold hover:text-primary-gold/80 px-8 py-3 rounded-full transition-all duration-300 transform hover:scale-105"
            >
              {showAll ? (
                <>
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Show Less
                </>
              ) : (
                <>
                  <Heart className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  See More Stories
                </>
              )}
            </Button>
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center">
          {/* Enhanced CTA Container */}
          <div className="relative max-w-4xl mx-auto">
            {/* Background decorative elements */}
            <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 via-accent-purple/5 to-primary-gold/5 rounded-3xl blur-3xl"></div>
            
            {/* Main CTA Card */}
            <div className="relative bg-gradient-to-br from-surface-white/95 via-surface-cream/90 to-surface-white/95 backdrop-blur-xl border border-border/50 rounded-3xl p-12 md:p-16 shadow-card">
              {/* Floating elements */}
              <div className="absolute top-8 left-8 w-4 h-4 bg-primary-gold/30 rounded-full animate-pulse"></div>
              <div className="absolute top-12 right-12 w-3 h-3 bg-accent-purple/40 rounded-full animate-pulse delay-300"></div>
              <div className="absolute bottom-8 left-12 w-2 h-2 bg-primary-gold/50 rounded-full animate-pulse delay-500"></div>
              <div className="absolute bottom-12 right-8 w-3 h-3 bg-primary-gold/30 rounded-full animate-pulse delay-700"></div>
              
              {/* Header with animated icons */}
              <div className="flex justify-center items-center gap-4 mb-8">
                <Heart className="w-8 h-8 text-accent-purple animate-pulse" />
                <div className="text-center">
                  <h3 className="text-3xl md:text-4xl font-bold text-text-primary mb-2">
                    Ready to Join the Karma Revolution?
                  </h3>
                  <p className="text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
                    Join thousands of legends who are already creating positive change through micro-acts of kindness
                  </p>
                </div>
                <Heart className="w-8 h-8 text-accent-purple animate-pulse delay-300" />
              </div>

              {/* Stats row */}
              <div className="flex justify-center items-center gap-8 mb-10 text-sm text-text-secondary">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                  <span>99,000+ Members</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-accent-purple rounded-full"></div>
                  <span>₹24.7L+ Raised</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-primary-gold rounded-full"></div>
                  <span>Instant Impact</span>
                </div>
              </div>

              {/* Enhanced CTA Button */}
              <div className="relative">
                {/* Button glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-accent-purple rounded-full blur-xl opacity-50 animate-pulse"></div>
                
                <Button 
                  onClick={handleGetMagicLink}
                  disabled={isLoading}
                  className="relative bg-gradient-to-r from-primary-gold to-accent-purple hover:from-primary-gold/90 hover:to-accent-purple/90 text-text-primary px-12 py-6 text-xl font-bold rounded-full transition-all duration-500 transform hover:scale-105 shadow-card hover:shadow-lg group overflow-hidden"
                >
                  {/* Animated background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-accent-purple opacity-0 group-hover:opacity-20 transition-opacity duration-300 animate-pulse" />
                  
                  {/* Sparkle effects */}
                  <div className="absolute inset-0 overflow-hidden rounded-full">
                    <div className="absolute top-3 left-6 w-1 h-1 bg-white rounded-full animate-ping" />
                    <div className="absolute top-6 right-8 w-1 h-1 bg-white rounded-full animate-ping delay-100" />
                    <div className="absolute bottom-4 left-10 w-1 h-1 bg-white rounded-full animate-ping delay-200" />
                  </div>

                  <div className="flex items-center justify-center gap-4 relative z-10">
                    <Crown className="w-7 h-7 animate-pulse" />
                    <span className="text-2xl font-bold">Get Magic Link</span>
                    <ArrowRight className="w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
                  </div>
                </Button>
              </div>

              {/* Trust indicators */}
              <div className="flex justify-center items-center gap-6 mt-8 text-sm text-text-secondary">
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

export default Testimonials; 