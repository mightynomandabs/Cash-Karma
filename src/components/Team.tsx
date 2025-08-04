import { useState, useEffect, useRef } from "react";
import { Linkedin, Github, Mail, ExternalLink, X, User, Sparkles, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const Team = () => {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);

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

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
        setSelectedMember(null);
      }
    };

    if (selectedMember !== null) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [selectedMember]);

  const teamMembers = [
    {
      id: 1,
      name: "Noman Mohammad Rafulla",
      role: "Founder & CEO",
      avatar: "/assets/avatars/fox.png",
      initials: "NMR",
      bio: "Former fintech executive with 10+ years building inclusive financial products. Passionate about democratizing generosity and making giving accessible to everyone.",
      longBio: "Noman has spent over a decade in fintech, working with companies that serve underserved communities. His vision for Cash Karma came from seeing how small acts of kindness could create massive ripple effects when amplified by technology.",
      linkedin: "https://linkedin.com/in/noman-mohammad-rafulla-cashkarma",
      github: "https://github.com/nomanrafulla",
      email: "noman@cashkarma.app",
      accent: "from-primary-gold/20 to-primary-gold/30",
      borderColor: "border-primary-gold/30",
      iconColor: "text-primary-gold"
    },
    {
      id: 2,
      name: "Priya Patel",
      role: "CTO",
      avatar: "/assets/avatars/panda.png",
      initials: "PP",
      bio: "Full-stack engineer passionate about social impact through technology. Loves building scalable, secure systems that make a difference.",
      longBio: "Priya brings her expertise in building robust, scalable systems to Cash Karma. She believes that technology should serve humanity, and every line of code should contribute to making the world a better place.",
      linkedin: "https://linkedin.com/in/priya-patel-cashkarma",
      github: "https://github.com/priyapatel",
      email: "priya@cashkarma.app",
      accent: "from-accent-purple/20 to-accent-purple/30",
      borderColor: "border-accent-purple/30",
      iconColor: "text-accent-purple"
    },
    {
      id: 3,
      name: "Arjun Mehta",
      role: "Head of Community",
      avatar: "/assets/avatars/robot.png",
      initials: "AM",
      bio: "Community builder focused on creating meaningful connections through giving. Believes in the power of collective action.",
      longBio: "Arjun has spent years building communities around shared values. At Cash Karma, he's creating spaces where strangers become family through the simple act of giving.",
      linkedin: "https://linkedin.com/in/arjun-mehta-cashkarma",
      github: "https://github.com/arjunmehta",
      email: "arjun@cashkarma.app",
      accent: "from-primary-gold/20 to-accent-purple/30",
      borderColor: "border-primary-gold/30",
      iconColor: "text-primary-gold"
    },
    {
      id: 4,
      name: "Aisha Khan",
      role: "Head of Product",
      avatar: "/assets/avatars/cat.png",
      initials: "AK",
      bio: "Product strategist with a heart for user experience. Dedicated to making giving accessible and enjoyable for everyone.",
      longBio: "Aisha's background in product design has taught her that the best products are those that feel invisible yet indispensable. She's making generosity as easy as breathing.",
      linkedin: "https://linkedin.com/in/aisha-khan-cashkarma",
      github: "https://github.com/aishakhan",
      email: "aisha@cashkarma.app",
      accent: "from-accent-purple/20 to-primary-gold/30",
      borderColor: "border-accent-purple/30",
      iconColor: "text-accent-purple"
    },
    {
      id: 5,
      name: "Vikram Singh",
      role: "Head of Security",
      avatar: "/assets/avatars/astronaut.png",
      initials: "VS",
      bio: "Security expert committed to protecting user data and building trust. Ensures every transaction is safe and secure.",
      longBio: "Vikram's expertise in cybersecurity ensures that every interaction on Cash Karma is protected by bank-level security. Trust is the foundation of everything we do.",
      linkedin: "https://linkedin.com/in/vikram-singh-cashkarma",
      github: "https://github.com/vikramsingh",
      email: "vikram@cashkarma.app",
      accent: "from-primary-gold/20 to-accent-purple/30",
      borderColor: "border-primary-gold/30",
      iconColor: "text-primary-gold"
    }
  ];

  return (
    <>
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
                meet the team
              </h2>
              <div className="w-32 h-1 bg-gradient-to-r from-primary-gold to-accent-purple mx-auto rounded-full shadow-soft mb-8" />
              <p className="text-xl text-text-secondary max-w-4xl mx-auto leading-relaxed">
                the legends behind cash karma. building the future of giving, one drop at a time.
              </p>
            </div>
          </div>

          {/* Premium Team Members Grid */}
          <div className={`transition-all duration-1000 ease-out delay-300 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {teamMembers.map((member, index) => (
                <div
                  key={member.id}
                  className={`transition-all duration-1000 ease-out delay-${400 + index * 200} ${
                    isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                  }`}
                >
                  <div
                    className={`group relative bg-gradient-to-br from-surface-white to-surface-cream backdrop-blur-xl border ${member.borderColor} rounded-3xl p-8 shadow-soft hover:shadow-card transition-all duration-500 cursor-pointer overflow-hidden ${
                      index % 2 === 0 ? 'hover:bg-gradient-to-br hover:from-primary-gold/5 hover:to-accent-purple/5' : 'hover:bg-gradient-to-br hover:from-accent-purple/5 hover:to-primary-gold/5'
                    }`}
                    onMouseEnter={() => setHoveredCard(index)}
                    onMouseLeave={() => setHoveredCard(null)}
                    onClick={() => setSelectedMember(member.id)}
                    style={{
                      transform: hoveredCard === index ? 'translateY(-8px) scale(1.02)' : 'translateY(0) scale(1)',
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
                    
                    {/* Avatar with Gradient Rim */}
                    <div className="relative z-10 text-center mb-6">
                      <div className="relative inline-block">
                        <div className={`w-24 h-24 rounded-full bg-gradient-to-br ${member.accent} p-1 shadow-soft group-hover:shadow-lg transition-all duration-500`}>
                          <Avatar className="w-full h-full">
                            <AvatarImage src={member.avatar} alt={member.name} />
                            <AvatarFallback className="bg-gradient-to-br from-primary-gold/20 to-accent-purple/20 text-text-primary font-bold text-xl">
                              {member.initials}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        
                        {/* Hover Glow Effect */}
                        <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.accent} blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                      </div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative z-10 text-center">
                      <h3 className="text-xl font-bold mb-2 text-text-primary group-hover:text-text-primary transition-colors duration-300">
                        {member.name}
                      </h3>
                      
                      <p className={`text-sm font-semibold mb-4 ${member.iconColor} group-hover:text-text-primary transition-colors duration-300`}>
                        {member.role}
                      </p>
                      
                      <p className="text-sm text-text-secondary leading-relaxed mb-6 group-hover:text-text-primary transition-colors duration-300">
                        {member.bio}
                      </p>
                      
                      {/* Connect Button */}
                      <Button 
                        variant="outline"
                        className="group/btn relative w-full bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 hover:from-primary-gold/20 hover:to-accent-purple/20 text-text-primary border-2 border-primary-gold/30 hover:border-primary-gold/50 font-semibold py-3 transition-all duration-300 group-hover:shadow-lg hover:scale-105 active:scale-95 backdrop-blur-sm"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/5 to-accent-purple/5 rounded-lg opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300" />
                        <div className="relative z-10 flex items-center gap-2">
                          <MessageCircle className="w-4 h-4" />
                          <span>Connect</span>
                          <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover/btn:translate-x-1" />
                        </div>
                      </Button>
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
          </div>

          {/* Enhanced Join the Team CTA */}
          <div className={`transition-all duration-1000 ease-out delay-1200 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
          }`}>
            <div className="text-center mt-20">
              <div className="relative bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 backdrop-blur-xl border border-primary-gold/30 rounded-3xl p-12 shadow-card hover:shadow-lg transition-all duration-500 group">
                {/* Glassmorphism Layers */}
                <div className="absolute inset-0 bg-surface-white/5 backdrop-blur-sm rounded-3xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-surface-white/10 to-transparent rounded-3xl" />
                
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-primary-gold to-accent-purple bg-clip-text text-transparent group-hover:scale-105 transition-transform duration-500">
                    want to join our mission?
                  </h3>
                  <p className="text-lg text-text-secondary mb-8 max-w-3xl mx-auto leading-relaxed group-hover:text-text-primary transition-colors duration-300">
                    we're always looking for passionate individuals who believe in the power of collective giving. 
                    let's build the future of generosity together.
                  </p>
                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Button className="group relative bg-gradient-to-r from-primary-gold to-accent-purple hover:from-primary-gold/90 hover:to-accent-purple/90 text-text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105">
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-accent-purple rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-3">
                        <Mail className="w-5 h-5" />
                        teamcashkarma@gmail.com
                      </div>
                    </Button>
                    <Button 
                      variant="outline"
                      className="group relative border-2 border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-primary-gold/10 to-primary-gold/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      <div className="relative z-10 flex items-center gap-3">
                        <ExternalLink className="w-5 h-5" />
                        view openings
                      </div>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Modal for Detailed Team Info */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div
            ref={modalRef}
            className="relative bg-gradient-to-br from-surface-white/95 to-surface-white/90 backdrop-blur-xl border border-surface-white/20 rounded-3xl p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-card animate-in fade-in-0 slide-in-from-bottom-4 duration-300"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-4 right-4 w-10 h-10 bg-surface-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-text-secondary hover:text-text-primary transition-colors duration-300"
            >
              <X className="w-5 h-5" />
            </button>
            
            {(() => {
              const member = teamMembers.find(m => m.id === selectedMember);
              if (!member) return null;
              
              return (
                <div className="text-center">
                  {/* Avatar */}
                  <div className="relative inline-block mb-8">
                    <div className={`w-32 h-32 rounded-full bg-gradient-to-br ${member.accent} p-2 shadow-lg`}>
                      <Avatar className="w-full h-full">
                        <AvatarImage src={member.avatar} alt={member.name} />
                        <AvatarFallback className="bg-gradient-to-br from-primary-gold/20 to-accent-purple/20 text-text-primary font-bold text-3xl">
                          {member.initials}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className={`absolute inset-0 rounded-full bg-gradient-to-br ${member.accent} blur-xl opacity-50`} />
                  </div>
                  
                  {/* Content */}
                  <h2 className="text-3xl font-bold mb-2 text-text-primary">{member.name}</h2>
                  <p className={`text-lg font-semibold mb-6 ${member.iconColor}`}>{member.role}</p>
                  <p className="text-text-secondary leading-relaxed mb-8 text-lg">{member.longBio}</p>
                  
                  {/* Social Links */}
                  <div className="flex justify-center gap-4 mb-8">
                    <a
                      href={member.linkedin}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-gradient-to-br from-blue-500/20 to-blue-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-blue-600 hover:text-blue-700 hover:bg-blue-600/30 transition-all duration-300 hover:scale-110"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-blue-600/20 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <Linkedin className="w-5 h-5 relative z-10" />
                    </a>
                    
                    <a
                      href={member.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group relative w-12 h-12 bg-gradient-to-br from-gray-500/20 to-gray-600/20 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-700 hover:text-gray-800 hover:bg-gray-600/30 transition-all duration-300 hover:scale-110"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-500/20 to-gray-600/20 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <Github className="w-5 h-5 relative z-10" />
                    </a>
                    
                    <a
                      href={`mailto:${member.email}`}
                      className="group relative w-12 h-12 bg-gradient-to-br from-primary-gold/20 to-primary-gold/30 backdrop-blur-sm rounded-full flex items-center justify-center text-primary-gold hover:text-primary-gold/80 hover:bg-primary-gold/30 transition-all duration-300 hover:scale-110"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-primary-gold/20 to-primary-gold/30 rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                      <Mail className="w-5 h-5 relative z-10" />
                    </a>
                  </div>
                  
                  {/* Connect Button */}
                  <Button 
                    className="group relative bg-gradient-to-r from-primary-gold to-accent-purple hover:from-primary-gold/90 hover:to-accent-purple/90 text-text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-primary-gold to-accent-purple rounded-full blur-lg opacity-50 group-hover:opacity-75 transition-opacity duration-300" />
                    <div className="relative z-10 flex items-center gap-3">
                      <MessageCircle className="w-5 h-5" />
                      <span>Connect with {member.name.split(' ')[0]}</span>
                      <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
                    </div>
                  </Button>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </>
  );
};

export default Team; 