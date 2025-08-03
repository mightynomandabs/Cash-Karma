import { Sparkles } from "lucide-react";
import Logo from "@/components/ui/Logo";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo - Left side */}
          <div className="flex items-center">
            <Logo size="sm" className="scale-90 sm:scale-100" />
          </div>

          {/* INVITATION ONLY Badge - Right side */}
          <div className="flex items-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-brand-yellow rounded-full shadow-sm">
              <Sparkles className="w-3 h-3 sm:w-4 sm:h-4 text-black" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider uppercase text-black">
                invitation only
              </span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 