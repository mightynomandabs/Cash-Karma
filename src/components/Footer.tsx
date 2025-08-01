import { Heart, Shield, Lock, Mail, MapPin, Phone, ExternalLink, Twitter, Instagram, Linkedin, Github, Facebook } from "lucide-react";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border/20 bg-background/80 backdrop-blur-sm w-full mt-auto relative z-10">
      <div className="max-w-7xl mx-auto px-6 py-16">
        {/* Main Footer Content */}
        <div className="grid lg:grid-cols-5 md:grid-cols-2 gap-8 mb-12">
          {/* LEFT COLUMN - Brand Section */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4 lowercase">cash karma</h3>
            <p className="text-muted-foreground mb-6 max-w-md">
              a social giving club for the bold, the kind, the curious. generosity, gamified.
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
              <Heart className="w-4 h-4 text-primary" />
              <span>building community, one drop at a time</span>
            </div>
            
            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="w-4 h-4 text-primary" />
                <a href="mailto:support@cashkarma.app" className="hover:text-primary transition-colors">
                  support@cashkarma.app
                </a>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 text-primary" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="w-4 h-4 text-primary" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMNS - Navigation */}
          {/* Column 1 - about */}
          <div>
            <h4 className="font-semibold mb-4">about</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">how it works</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">our story</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">blog</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">community</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">faq</a></li>
            </ul>
          </div>

          {/* Column 2 - support */}
          <div>
            <h4 className="font-semibold mb-4">support</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">help center</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">contact us</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">status page</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">feedback</a></li>
            </ul>
          </div>

          {/* Column 3 - legal */}
          <div>
            <h4 className="font-semibold mb-4">legal</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">privacy policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">terms of service</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">cookie policy</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">transparency</a></li>
            </ul>
          </div>

          {/* Column 4 - security */}
          <div>
            <h4 className="font-semibold mb-4">security</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><a href="#" className="hover:text-primary transition-colors">security overview</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">compliance</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">bug bounty</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">report issue</a></li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators Section */}
        <div className="mb-12">
          <h4 className="font-semibold mb-6 text-center">trusted by</h4>
          <div className="flex flex-wrap justify-center items-center gap-8 opacity-60">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-primary/20 rounded-lg flex items-center justify-center">
                <span className="text-primary font-bold text-xs">R</span>
              </div>
              <span>Razorpay</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-secondary/20 rounded-lg flex items-center justify-center">
                <span className="text-secondary font-bold text-xs">S</span>
              </div>
              <span>Supabase</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <div className="w-8 h-8 bg-accent/20 rounded-lg flex items-center justify-center">
                <span className="text-accent font-bold text-xs">P</span>
              </div>
              <span>PCI DSS</span>
            </div>
          </div>
        </div>

        {/* Testimonial Section */}
        <div className="mb-12">
          <div className="bg-card/30 backdrop-blur-sm border border-border/20 rounded-xl p-6">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">A</span>
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground mb-2 italic">
                  "Cash Karma has completely changed how I think about giving. The community aspect makes it so much more meaningful than traditional charity."
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium">Aisha K.</span>
                  <span className="text-xs text-muted-foreground">•</span>
                  <span className="text-xs text-muted-foreground">Member since 2023</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Staff/Founder Section */}
        <div className="mb-12">
          <h4 className="font-semibold mb-6 text-center">meet the team</h4>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-primary font-bold text-lg">R</span>
              </div>
              <h5 className="font-medium mb-1">Rahul Sharma</h5>
              <p className="text-xs text-muted-foreground mb-2">Founder & CEO</p>
              <p className="text-xs text-muted-foreground">
                Former fintech executive with 10+ years building inclusive financial products.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-secondary font-bold text-lg">P</span>
              </div>
              <h5 className="font-medium mb-1">Priya Patel</h5>
              <p className="text-xs text-muted-foreground mb-2">CTO</p>
              <p className="text-xs text-muted-foreground">
                Full-stack engineer passionate about social impact through technology.
              </p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-accent/20 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-accent font-bold text-lg">A</span>
              </div>
              <h5 className="font-medium mb-1">Arjun Mehta</h5>
              <p className="text-xs text-muted-foreground mb-2">Head of Community</p>
              <p className="text-xs text-muted-foreground">
                Community builder focused on creating meaningful connections through giving.
              </p>
            </div>
          </div>
        </div>

        {/* Security Banner */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 p-6 bg-card/30 backdrop-blur-sm border border-border/20 rounded-xl mb-8">
          <div className="flex items-center gap-3">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              your data, secured with love. pci-dss compliant. 100% encrypted.
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="w-3 h-3" />
            <span>no fine print. just protection.</span>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center gap-4">
            <a href="#" className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300 hover:shadow-glow">
              <Twitter className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-secondary hover:bg-secondary/20 transition-all duration-300 hover:shadow-yellow">
              <Instagram className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-accent hover:bg-accent/20 transition-all duration-300 hover:shadow-pink">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/20 transition-all duration-300 hover:shadow-glow">
              <Github className="w-4 h-4" />
            </a>
            <a href="#" className="w-10 h-10 bg-muted/50 rounded-full flex items-center justify-center text-muted-foreground hover:text-secondary hover:bg-secondary/20 transition-all duration-300 hover:shadow-yellow">
              <Facebook className="w-4 h-4" />
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-8 border-t border-border/20">
          <div className="text-sm text-muted-foreground">
            © {currentYear} cash karma. made with ❤️ for legends everywhere.
          </div>
          
          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <span>mumbai, india</span>
            <span>•</span>
            <a href="mailto:support@cashkarma.app" className="hover:text-primary transition-colors">
              support@cashkarma.app
            </a>
            <span>•</span>
            <a href="#" className="hover:text-primary transition-colors flex items-center gap-1">
              transparency report
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;