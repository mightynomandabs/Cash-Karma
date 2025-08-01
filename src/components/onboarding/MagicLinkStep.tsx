import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, User, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginStepProps {
  onNext: () => void;
  onClose: () => void;
}

const LoginStep = ({ onNext, onClose }: LoginStepProps) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    const { error: authError } = await signIn(username, password);

    if (authError) {
      setError(authError);
      setLoading(false);
    } else {
      setLoading(false);
      // Auto advance after successful login
      setTimeout(() => {
        onNext();
      }, 1000);
    }
  };

  const isValidForm = username.trim() && password.trim();

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="text-center space-y-6">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-primary/20 rounded-full mb-4">
          <User className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-4xl font-bold lowercase tracking-tight">
          join the club
        </h2>
        <p className="text-xl text-muted-foreground max-w-md mx-auto leading-relaxed">
          sign in to start spreading karma
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-4">
          <div className="relative">
            <Input
              type="email"
              placeholder="your@email.com"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="h-16 text-xl bg-input/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 px-6 pr-12"
              autoFocus
              disabled={loading}
            />
            <User className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          </div>

          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-16 text-xl bg-input/50 border-border/30 focus:border-primary/50 focus:ring-primary/20 px-6 pr-12"
              disabled={loading}
            />
            <Lock className="absolute right-12 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0"
            >
              {showPassword ? (
                <EyeOff className="w-4 h-4 text-muted-foreground" />
              ) : (
                <Eye className="w-4 h-4 text-muted-foreground" />
              )}
            </Button>
          </div>

          {error && (
            <p className="text-sm text-destructive text-center bg-destructive/10 p-3 rounded-lg">
              {error}
            </p>
          )}
        </div>

        <Button
          type="submit"
          disabled={!isValidForm || loading}
          className="w-full h-16 text-xl btn-neon group font-bold"
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-6 h-6 border-3 border-current border-t-transparent rounded-full animate-spin" />
              <span>signing in...</span>
            </div>
          ) : (
            <>
              sign in
              <ArrowRight className="w-6 h-6 ml-3 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Test Accounts Info */}
      <div className="space-y-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground mb-2">
            test accounts:
          </p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <p>testuser@example.com / password123</p>
            <p>admin@test.com / admin123</p>
            <p>demo@demo.com / demo123</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center">
        <p className="text-xs text-muted-foreground">
          by continuing, you agree to our terms and privacy policy
        </p>
      </div>
    </div>
  );
};

export default LoginStep;