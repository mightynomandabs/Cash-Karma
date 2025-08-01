import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Mail, Check, ArrowRight } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface MagicLinkStepProps {
  onNext: () => void;
  onClose: () => void;
}

const MagicLinkStep = ({ onNext, onClose }: MagicLinkStepProps) => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const { signInWithMagicLink } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");

    const { error: authError } = await signInWithMagicLink(email);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess(true);
      setLoading(false);
      // Auto advance after showing success
      setTimeout(() => {
        onNext();
      }, 2000);
    }
  };

  const isValidEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  if (success) {
    return (
      <div className="text-center space-y-8">
        {/* Success Animation */}
        <div className="relative">
          <div className="w-24 h-24 mx-auto bg-primary/20 rounded-full flex items-center justify-center mb-8">
            <Check className="w-12 h-12 text-primary animate-scale-in" />
          </div>
          {/* Confetti Effect */}
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className={cn(
                  "absolute w-3 h-3 rounded-full animate-bounce",
                  i % 3 === 0 ? "bg-primary" : i % 3 === 1 ? "bg-accent" : "bg-neon-purple"
                )}
                style={{
                  left: `${15 + (i * 7)}%`,
                  top: `${25 + (i % 2) * 25}%`,
                  animationDelay: `${i * 100}ms`,
                  animationDuration: "1.5s"
                }}
              />
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <h3 className="text-3xl font-bold">check your inbox!</h3>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            we've sent a magic link to <span className="text-primary font-bold">{email}</span>. 
            click it to join the club.
          </p>
          <p className="text-sm text-muted-foreground">
            didn't get it? check your spam folder or try again.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4">
          <Mail className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold lowercase tracking-tight">
          join the club
        </h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
          no passwords, no stress. get your magic link.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="space-y-4">
          <Input
            type="email"
            placeholder="your@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="h-16 text-xl bg-input/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 px-6"
            autoFocus
            disabled={loading}
          />
          {error && (
            <p className="text-sm text-destructive text-center">{error}</p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValidEmail(email) || loading}
          className="w-full h-16 text-xl btn-neon group font-bold"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
              <span>sending magic...</span>
            </div>
          ) : (
            <>
              send magic link
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          by continuing, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
};

export default MagicLinkStep;