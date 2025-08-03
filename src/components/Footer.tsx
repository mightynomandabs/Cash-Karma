import { Mail, Heart, Sparkles, Twitter, Instagram, Linkedin, Github, Phone, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('support@cashkarma.app');
    // You could add a toast notification here
  };

  const handleCopyPhone = () => {
    navigator.clipboard.writeText('+91 98765 43210');
    // You could add a toast notification here
  };

  return (
    <footer className="bg-surface-gray-100/50 backdrop-blur-sm border-t border-border/20">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Contact Card Section */}
        <div className="mb-16">
          <div className="bg-gradient-to-r from-primary-gold/10 to-accent-purple/10 border border-primary-gold/30 rounded-2xl p-8 shadow-soft">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-bold mb-2 text-text-primary">
                get in touch
              </h3>
              <p className="text-text-secondary text-sm">
                questions? feedback? we'd love to hear from you
              </p>
            </div>
            
            {/* Contact Information Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-primary-gold/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Mail className="w-5 h-5 text-primary-gold" />
                </div>
                <h4 className="font-semibold text-sm mb-1 text-text-primary">email us</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    support@cashkarma.app
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyEmail}
                    className="p-1 h-6 w-6 text-text-secondary hover:text-primary-gold transition-colors duration-300"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-accent-purple/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <Phone className="w-5 h-5 text-accent-purple" />
                </div>
                <h4 className="font-semibold text-sm mb-1 text-text-primary">call us</h4>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-text-secondary">
                    +91 98765 43210
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCopyPhone}
                    className="p-1 h-6 w-6 text-text-secondary hover:text-accent-purple transition-colors duration-300"
                  >
                    <Sparkles className="w-3 h-3" />
                  </Button>
                </div>
              </div>

              <div className="flex flex-col items-center text-center group">
                <div className="w-12 h-12 bg-primary-gold/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform duration-300">
                  <MapPin className="w-5 h-5 text-primary-gold" />
                </div>
                <h4 className="font-semibold text-sm mb-1 text-text-primary">visit us</h4>
                <span className="text-sm text-text-secondary">
                  Mumbai, India
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Main Footer Content - 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {/* Column 1 - About */}
          <div>
            <h4 className="font-bold mb-4 text-primary-gold">about</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/how-it-works" className="hover:text-primary-gold transition-colors">how it works</a></li>
              <li><a href="/our-story" className="hover:text-primary-gold transition-colors">our story</a></li>
              <li><a href="/community" className="hover:text-primary-gold transition-colors">community</a></li>
              <li><a href="/faq" className="hover:text-primary-gold transition-colors">faq</a></li>
            </ul>
          </div>

          {/* Column 2 - Support */}
          <div>
            <h4 className="font-bold mb-4 text-accent-purple">support</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/help" className="hover:text-accent-purple transition-colors">help center</a></li>
              <li><a href="/contact" className="hover:text-accent-purple transition-colors">contact us</a></li>
              <li><a href="/feedback" className="hover:text-accent-purple transition-colors">feedback</a></li>
              <li><a href="/status" className="hover:text-accent-purple transition-colors">status page</a></li>
            </ul>
          </div>

          {/* Column 3 - Legal */}
          <div>
            <h4 className="font-bold mb-4 text-primary-gold">legal</h4>
            <ul className="space-y-2 text-sm text-text-secondary">
              <li><a href="/privacy" className="hover:text-primary-gold transition-colors">privacy policy</a></li>
              <li><a href="/terms" className="hover:text-primary-gold transition-colors">terms of service</a></li>
              <li><a href="/cookies" className="hover:text-primary-gold transition-colors">cookie policy</a></li>
              <li><a href="/security" className="hover:text-primary-gold transition-colors">security</a></li>
            </ul>
          </div>

          {/* Column 4 - Follow Us */}
          <div>
            <h4 className="font-bold mb-4 text-accent-purple">follow us</h4>
            <div className="flex gap-3 mb-4">
              <a 
                href="https://twitter.com/cashkarma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-white/50 rounded-full flex items-center justify-center text-text-secondary hover:text-blue-400 hover:bg-blue-400/20 transition-all duration-300 hover:scale-110"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="https://instagram.com/cashkarma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-white/50 rounded-full flex items-center justify-center text-text-secondary hover:text-pink-500 hover:bg-pink-500/20 transition-all duration-300 hover:scale-110"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href="https://linkedin.com/company/cashkarma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-white/50 rounded-full flex items-center justify-center text-text-secondary hover:text-blue-600 hover:bg-blue-600/20 transition-all duration-300 hover:scale-110"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="https://github.com/cashkarma" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 bg-surface-white/50 rounded-full flex items-center justify-center text-text-secondary hover:text-gray-800 hover:bg-gray-800/20 transition-all duration-300 hover:scale-110"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
            <p className="text-xs text-text-secondary">
              Join our community of karma legends
            </p>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-8 border-t border-border/20">
          <div className="flex items-center gap-2 text-sm text-text-secondary">
            <Sparkles className="w-4 h-4 text-primary-gold" />
            <span>© {currentYear} cash karma. all rights reserved.</span>
          </div>
          
          <div className="flex items-center gap-6 text-sm">
            <a href="/privacy" className="text-text-secondary hover:text-primary-gold transition-colors">
              privacy
            </a>
            <a href="/terms" className="text-text-secondary hover:text-primary-gold transition-colors">
              terms
            </a>
            <a href="/cookies" className="text-text-secondary hover:text-primary-gold transition-colors">
              cookies
            </a>
            <a href="/security" className="text-text-secondary hover:text-primary-gold transition-colors">
              security
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;