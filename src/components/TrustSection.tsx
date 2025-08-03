import { useState, useEffect, useRef } from "react";
import { Shield, Lock, CheckCircle, Sparkles, Award, BadgeCheck, Zap } from "lucide-react";

const TrustSection = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredLogo, setHoveredLogo] = useState<number | null>(null);
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

  const partners = [
    {
      name: "Razorpay",
      logo: "/partners/razorpay.jpg",
      description: "PCI DSS Level 1 certified payment gateway",
      certification: "Payment Security",
      delay: 200
    },
    {
      name: "Supabase",
      logo: "/partners/supabase.jpg", 
      description: "SOC 2 Type II certified database platform",
      certification: "Data Security",
      delay: 400
    },
    {
      name: "PCI DSS",
      logo: "/partners/pci-dss.png",
      description: "Payment Card Industry Data Security Standard",
      certification: "Compliance",
      delay: 600
    }
  ];

  const securityFeatures = [
    {
      icon: Shield,
      title: "Bank-Level Security",
      description: "256-bit SSL encryption",
      color: "text-brand-green"
    },
    {
      icon: Lock,
      title: "Zero Data Storage",
      description: "We never store your payment info",
      color: "text-brand-pink"
    },
    {
      icon: CheckCircle,
      title: "Real-Time Monitoring",
      description: "24/7 fraud detection",
      color: "text-brand-yellow"
    }
  ];

  return (
    <section ref={sectionRef} className="py-24 px-6 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-muted/20" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-brand-green/5 to-brand-pink/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-brand-yellow/5 to-brand-green/5 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Enhanced Section Header */}
        <div className={`transition-all duration-1000 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <div className="text-center mb-20">
            <h2 className="text-5xl md:text-7xl font-black mb-8 lowercase tracking-tight bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink bg-clip-text text-transparent hover:scale-105 transition-transform duration-700">
              built on trust
            </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-brand-green via-brand-yellow to-brand-pink mx-auto rounded-full shadow-lg mb-8" />
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              powered by industry-leading security partners and compliance standards
            </p>
          </div>
        </div>

        {/* Partner Logos Grid */}
        <div className={`transition-all duration-1000 ease-out delay-300 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {partners.map((partner, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ease-out delay-${partner.delay} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div
                  className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-500 cursor-pointer overflow-hidden"
                  onMouseEnter={() => setHoveredLogo(index)}
                  onMouseLeave={() => setHoveredLogo(null)}
                  style={{
                    transform: hoveredLogo === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
                  }}
                >
                  {/* Glassmorphism Effect */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-3xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-3xl" />
                  
                  {/* Logo Container */}
                  <div className="relative z-10 text-center">
                    <div className="relative inline-block mb-6">
                      <div className="w-24 h-24 mx-auto bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center p-4 shadow-lg group-hover:shadow-xl transition-all duration-500">
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-full h-full object-contain filter brightness-0 dark:brightness-100 group-hover:brightness-110 transition-all duration-500"
                        />
                      </div>
                      
                      {/* Certification Badge */}
                      <div className="absolute -top-2 -right-2 bg-gradient-to-r from-brand-green to-brand-pink text-white text-xs font-bold px-2 py-1 rounded-full shadow-lg">
                        {partner.certification}
                      </div>
                    </div>
                    
                    <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-foreground transition-colors duration-300">
                      {partner.name}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {partner.description}
                    </p>
                  </div>
                  
                  {/* Hover Effects */}
                  <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-brand-green/5 via-brand-yellow/5 to-brand-pink/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  {/* Particle Effects on Hover */}
                  {hoveredLogo === index && (
                    <div className="absolute inset-0 rounded-3xl overflow-hidden">
                      <div className="absolute top-2 right-2 w-2 h-2 bg-brand-green/60 rounded-full animate-ping" />
                      <div className="absolute bottom-2 left-2 w-1.5 h-1.5 bg-brand-pink/60 rounded-full animate-ping delay-200" />
                      <div className="absolute top-1/2 right-4 w-1 h-1 bg-brand-yellow/60 rounded-full animate-ping delay-400" />
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Security Features Grid */}
        <div className={`transition-all duration-1000 ease-out delay-800 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
            {securityFeatures.map((feature, index) => (
              <div
                key={index}
                className={`transition-all duration-1000 ease-out delay-${900 + index * 200} ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                }`}
              >
                <div className="group relative bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-xl border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500">
                  {/* Glassmorphism Effect */}
                  <div className="absolute inset-0 bg-white/5 backdrop-blur-sm rounded-2xl" />
                  <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent rounded-2xl" />
                  
                  <div className="relative z-10 text-center">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-green/20 to-brand-pink/20 mb-4 group-hover:scale-110 transition-all duration-500`}>
                      <feature.icon className={`w-8 h-8 ${feature.color} group-hover:animate-pulse transition-all duration-300`} />
                    </div>
                    
                    <h3 className="text-lg font-bold mb-2 text-foreground group-hover:text-foreground transition-colors duration-300">
                      {feature.title}
                    </h3>
                    
                    <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Trust Badge */}
        <div className={`transition-all duration-1000 ease-out delay-1200 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        }`}>
          <div className="text-center">
            <div className="inline-flex items-center gap-6 px-12 py-8 bg-gradient-to-r from-brand-green/10 to-brand-pink/10 backdrop-blur-xl border border-brand-yellow/30 rounded-3xl shadow-2xl hover:shadow-3xl transition-all duration-500 group">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Shield className="w-8 h-8 text-brand-yellow group-hover:animate-pulse" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-brand-green rounded-full animate-ping" />
                </div>
                <div>
                  <div className="text-lg font-bold text-foreground group-hover:text-foreground transition-colors duration-300">
                    your data, secured with love
                  </div>
                  <div className="text-sm text-muted-foreground group-hover:text-muted-foreground transition-colors duration-300">
                    bank-level encryption & zero data storage
                  </div>
                </div>
              </div>
              
              <div className="w-px h-12 bg-brand-yellow/30"></div>
              
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Lock className="w-6 h-6 text-brand-green group-hover:animate-bounce" />
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    100% encrypted
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-brand-pink group-hover:animate-bounce" />
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    no fine print
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Award className="w-6 h-6 text-brand-yellow group-hover:animate-bounce" />
                  <span className="text-sm font-semibold text-muted-foreground group-hover:text-foreground transition-colors duration-300">
                    compliant
                  </span>
                </div>
              </div>
              
              <Sparkles className="w-6 h-6 text-brand-yellow group-hover:animate-bounce" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSection; 