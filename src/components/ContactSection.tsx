import { useState } from "react";
import { Mail, Phone, MapPin, MessageCircle, Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import OnboardingModal from "./onboarding/OnboardingModal";

const ContactSection = () => {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const contactMethods = [
    {
      id: 'email',
      icon: Mail,
      title: 'Email Us',
      value: 'teamcashkarma@gmail.com',
      description: 'Get in touch with our support team',
      color: 'text-primary-gold',
      bgColor: 'bg-primary-gold/20',
      borderColor: 'border-primary-gold/30'
    },
    {
      id: 'phone',
      icon: Phone,
      title: 'Call Us',
      value: '+91 6361539536',
      description: 'Speak directly with our team',
      color: 'text-accent-purple',
      bgColor: 'bg-accent-purple/20',
      borderColor: 'border-accent-purple/30'
    },
    {
      id: 'address',
      icon: MapPin,
      title: 'Visit Us',
      value: 'Mumbai, India',
      description: 'Our headquarters location',
      color: 'text-primary-gold',
      bgColor: 'bg-primary-gold/20',
      borderColor: 'border-primary-gold/30'
    }
  ];

  const handleCopy = async (value: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const handleGetMagicLink = async () => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setShowOnboarding(true);
  };

  return (
    <section className="py-24 px-6 bg-surface-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-surface-white via-surface-cream to-surface-gray-50" />
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-primary-gold/5 to-accent-purple/5 rounded-full blur-3xl animate-pulse-soft" />
      <div className="absolute bottom-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-accent-purple/5 to-primary-gold/5 rounded-full blur-3xl animate-pulse-soft delay-1000" />
      
      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 mb-4">
            <MessageCircle className="w-6 h-6 text-primary-gold" />
            <span className="text-sm font-semibold text-primary-gold">Contact</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 text-text-primary">
            get in touch
          </h2>
          <p className="text-lg text-text-secondary max-w-3xl mx-auto leading-relaxed">
            have questions? want to collaborate? we'd love to hear from you. 
            our team is here to help you on your karma journey.
          </p>
        </div>

        {/* Contact Methods Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {contactMethods.map((method) => (
            <Card 
              key={method.id}
              className={`bg-surface-white border ${method.borderColor} rounded-xl shadow-soft hover:shadow-card transition-all duration-300 group`}
            >
              <CardHeader className="text-center pb-4">
                <div className={`w-16 h-16 ${method.bgColor} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className={`w-8 h-8 ${method.color}`} />
                </div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">
                  {method.title}
                </h3>
                <p className="text-text-secondary text-sm">
                  {method.description}
                </p>
              </CardHeader>
              
              <CardContent className="text-center">
                <div className="flex items-center justify-center gap-3">
                  <span className="text-text-primary font-medium">
                    {method.value}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopy(method.value, method.id)}
                    className={`p-2 h-8 w-8 ${method.color} hover:${method.bgColor} transition-all duration-300`}
                  >
                    {copiedField === method.id ? (
                      <Check className="w-4 h-4" />
                    ) : (
                      <Copy className="w-4 h-4" />
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Form CTA */}
        <div className="text-center">
          <div className="bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 border border-primary-gold/30 rounded-2xl p-12 shadow-soft">
            <h3 className="text-2xl font-bold text-text-primary mb-4">
              Ready to start your karma journey?
            </h3>
            <p className="text-text-secondary mb-8 max-w-2xl mx-auto leading-relaxed">
              Join thousands of legends who are already creating positive change through micro-acts of kindness. 
              Get your magic link and start spreading karma today.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetMagicLink}
                disabled={isLoading}
                className="bg-primary-gold hover:bg-primary-gold-dark text-text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-soft"
              >
                <div className="flex items-center gap-3">
                  <MessageCircle className="w-5 h-5" />
                  <span>{isLoading ? 'Loading...' : 'Get Magic Link'}</span>
                </div>
              </Button>
              
              <Button 
                variant="outline"
                onClick={() => {
                  const subject = encodeURIComponent('Cash Karma Support Request');
                  const body = encodeURIComponent('Hello Cash Karma team,\n\nI would like to get in touch regarding:\n\n[Please describe your inquiry here]\n\nThank you!');
                  window.open(`mailto:teamcashkarma@gmail.com?subject=${subject}&body=${body}`, '_blank');
                }}
                className="border-2 border-primary-gold text-primary-gold hover:bg-primary-gold hover:text-text-primary px-8 py-4 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
              >
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5" />
                  <span>Send Message</span>
                </div>
              </Button>
            </div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-16 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Response Time</h4>
              <p className="text-text-secondary text-sm">Within 24 hours</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Support Hours</h4>
              <p className="text-text-secondary text-sm">Mon-Fri, 9AM-6PM IST</p>
            </div>
            <div>
              <h4 className="font-semibold text-text-primary mb-2">Languages</h4>
              <p className="text-text-secondary text-sm">English & Hindi</p>
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

export default ContactSection; 