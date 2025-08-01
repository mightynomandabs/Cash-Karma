import { Dice1, Eye, Users, Shield, Button } from "lucide-react";
import { Button as UIButton } from "@/components/ui/button";

const FeaturesSection = () => {
  const features = [
    {
      icon: Dice1,
      title: "a game of karma, not luck",
      description: "micro amounts, random matches",
      accent: "text-primary"
    },
    {
      icon: Eye,
      title: "total transparency",
      description: "live feed, no hidden fees, only 2% to cover costs",
      accent: "text-accent"
    },
    {
      icon: Users,
      title: "community > competition",
      description: "badges for streaks, not referrals",
      accent: "text-brand-yellow"
    }
  ];

  return (
    <section className="py-24 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 lowercase tracking-tight">
            why cash karma works
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            built on trust, powered by community, secured by technology
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="card-feature group">
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-full bg-muted/30 mb-6 group-hover:${feature.accent} transition-colors`}>
                <feature.icon className={`w-6 h-6 ${feature.accent}`} />
              </div>
              
              <h3 className="text-xl font-semibold mb-3 lowercase tracking-tight">
                {feature.title}
              </h3>
              
              <p className="text-muted-foreground leading-relaxed mb-6">
                {feature.description}
              </p>
              
              {/* Learn More Button */}
              <UIButton 
                variant="outline" 
                className="w-full border-muted-foreground/30 text-muted-foreground hover:text-foreground hover:border-foreground/50 transition-colors"
              >
                learn more
              </UIButton>
              
              {/* Subtle accent line */}
              <div className={`mt-4 h-0.5 w-12 bg-gradient-to-r from-${feature.accent.replace('text-', '')} to-transparent opacity-50`} />
            </div>
          ))}
        </div>

        {/* Social Proof Section */}
        <div className="mt-20 text-center space-y-8">
          <div className="text-sm text-muted-foreground/70 tracking-wide">
            built on razorpay. powered by supabase. trusted by thousands.
          </div>
          
          {/* Security highlight */}
          <div className="inline-flex items-center gap-3 px-6 py-4 bg-card/40 backdrop-blur-sm border border-border/30 rounded-xl">
            <Shield className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium">
              your data, secured with love. pci-dss. 100% encrypted. no fine print.
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;