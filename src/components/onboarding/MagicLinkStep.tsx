import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { 
  Mail, 
  Lock, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Shield, 
  Sparkles,
  AlertCircle,
  CheckCircle,
  User
} from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";

interface LoginStepProps {
  onNext: () => void;
  onClose: () => void;
}

const LoginStep = ({ onNext, onClose }: LoginStepProps) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loginMethod, setLoginMethod] = useState<"magic" | "password" | "test">("magic");
  const { signInWithMagicLink, signInWithGoogle, signInWithTestCredentials } = useAuth();

  const handleMagicLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const { error: authError } = await signInWithMagicLink(email);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess("Magic link sent! Check your email and click the link to sign in.");
      setLoading(false);
      // Don't auto-advance - user needs to click the magic link first
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");

    // For now, show an error since we're focusing on magic link
    setError("Password login is not available. Please use magic link authentication.");
    setLoading(false);
  };

  const handleTestCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setLoading(true);
    setError("");
    setSuccess("");

    const { error: authError } = await signInWithTestCredentials(email, password);

    if (authError) {
      setError(authError.message);
      setLoading(false);
    } else {
      setSuccess("Test authentication successful! Redirecting...");
      setLoading(false);
      // Auto-advance to next step for test users
      setTimeout(() => {
        onNext();
      }, 1500);
    }
  };

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError("");
    setSuccess("");

    const { error: authError } = await signInWithGoogle();

    if (authError) {
      setError(authError.message);
      setGoogleLoading(false);
    } else {
      setSuccess("Redirecting to Google for authentication...");
      // Google OAuth will handle the redirect automatically
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    if (loginMethod === "magic") {
      handleMagicLinkSubmit(e);
    } else if (loginMethod === "password") {
      handlePasswordSubmit(e);
    } else if (loginMethod === "test") {
      handleTestCredentialsSubmit(e);
    }
  };

  const isValidForm = email.trim() && (loginMethod === "magic" || password.trim());

  return (
    <div className="space-y-6">
      {/* Login Method Toggle */}
      <div className="flex bg-muted/30 rounded-lg p-1">
        <Button
          type="button"
          variant={loginMethod === "magic" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLoginMethod("magic")}
          className={cn(
            "flex-1 text-sm font-medium transition-all duration-200",
            loginMethod === "magic" 
              ? "bg-background shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Mail className="w-4 h-4 mr-2" />
          Magic Link
        </Button>
        <Button
          type="button"
          variant={loginMethod === "password" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLoginMethod("password")}
          className={cn(
            "flex-1 text-sm font-medium transition-all duration-200",
            loginMethod === "password" 
              ? "bg-background shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <Lock className="w-4 h-4 mr-2" />
          Password
        </Button>
        <Button
          type="button"
          variant={loginMethod === "test" ? "default" : "ghost"}
          size="sm"
          onClick={() => setLoginMethod("test")}
          className={cn(
            "flex-1 text-sm font-medium transition-all duration-200",
            loginMethod === "test" 
              ? "bg-background shadow-sm" 
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          <User className="w-4 h-4 mr-2" />
          Test
        </Button>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-foreground">
            {loginMethod === "test" ? "Test Username" : "Email Address"}
          </Label>
          <div className="relative">
            <Input
              id="email"
              type={loginMethod === "test" ? "text" : "email"}
              placeholder={loginMethod === "test" ? "testuser@example.com" : "your@email.com"}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={cn(
                "h-12 text-base bg-background/50 border-border/30",
                "focus:border-primary/50 focus:ring-primary/20 focus:ring-2",
                "transition-all duration-200",
                "pl-11 pr-4"
              )}
              autoFocus
              disabled={loading}
              aria-describedby={error ? "email-error" : undefined}
            />
            {loginMethod === "test" ? (
              <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            ) : (
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            )}
          </div>
          {error && (
            <p id="email-error" className="text-sm text-destructive flex items-center gap-2">
              <AlertCircle className="w-4 h-4" />
              {error}
            </p>
          )}
          {success && (
            <p className="text-sm text-primary flex items-center gap-2">
              <CheckCircle className="w-4 h-4" />
              {success}
            </p>
          )}
        </div>

        {/* Password Field - Show for password and test login */}
        {(loginMethod === "password" || loginMethod === "test") && (
          <div className="space-y-2">
            <Label htmlFor="password" className="text-sm font-medium text-foreground">
              {loginMethod === "test" ? "Test Password" : "Password"}
            </Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder={loginMethod === "test" ? "password123" : "Enter your password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={cn(
                  "h-12 text-base bg-background/50 border-border/30",
                  "focus:border-primary/50 focus:ring-primary/20 focus:ring-2",
                  "transition-all duration-200",
                  "pl-11 pr-12"
                )}
                disabled={loading}
              />
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 w-8 h-8 p-0 hover:bg-muted/50"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <EyeOff className="w-4 h-4 text-muted-foreground" />
                ) : (
                  <Eye className="w-4 h-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        )}

        {/* Magic Link Explanation */}
        {loginMethod === "magic" && (
          <div className="flex items-start gap-3 p-3 bg-primary/5 border border-primary/20 rounded-lg">
            <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Secure & Instant</p>
              <p>We'll send a secure login link to your email. No password needed!</p>
            </div>
          </div>
        )}

        {/* Test Credentials Explanation */}
        {loginMethod === "test" && (
          <div className="flex items-start gap-3 p-3 bg-accent/5 border border-accent/20 rounded-lg">
            <User className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
            <div className="text-sm text-muted-foreground">
              <p className="font-medium text-foreground mb-1">Test Authentication</p>
              <p>Use test credentials for development and testing purposes.</p>
            </div>
          </div>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={!isValidForm || loading}
          className={cn(
            "w-full h-12 text-base font-semibold transition-all duration-200",
            "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary",
            "text-primary-foreground shadow-lg hover:shadow-xl",
            "transform hover:scale-[1.02] active:scale-[0.98]",
            "group"
          )}
        >
          {loading ? (
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
              <span>
                {loginMethod === "magic" ? "Sending..." : loginMethod === "test" ? "Authenticating..." : "Signing in..."}
              </span>
            </div>
          ) : (
            <>
              {loginMethod === "magic" ? "Send Magic Link" : loginMethod === "test" ? "Test Login" : "Sign In"}
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </>
          )}
        </Button>
      </form>

      {/* Social Login Options */}
      <div className="space-y-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <Separator className="w-full" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-3">
          <Button
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="h-11 bg-background/50 border-border/30 hover:bg-background/80 transition-all duration-200"
          >
            {googleLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                <span>Connecting to Google...</span>
              </div>
            ) : (
              <>
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-3">
        {loginMethod === "password" && (
          <div className="text-center">
            <Button
              variant="link"
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              Forgot your password?
            </Button>
          </div>
        )}
        
        <div className="text-center">
          <Button
            variant="link"
            onClick={onClose}
            className="text-sm text-muted-foreground hover:text-primary transition-colors"
          >
            Back to Home
          </Button>
        </div>
      </div>

      {/* Legal & Security */}
      <div className="space-y-4 pt-4 border-t border-border/20">
        <div className="text-center">
          <p className="text-xs text-muted-foreground leading-relaxed">
            By continuing, you agree to our{" "}
            <Button variant="link" className="text-xs p-0 h-auto text-primary hover:text-primary/80">
              Terms of Service
            </Button>{" "}
            and{" "}
            <Button variant="link" className="text-xs p-0 h-auto text-primary hover:text-primary/80">
              Privacy Policy
            </Button>
          </p>
        </div>

        {/* Security Badge */}
        <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Shield className="w-3 h-3" />
          <span>Bank-level security & encryption</span>
        </div>
      </div>

      {/* Test Accounts - Only in Development */}
      {process.env.NODE_ENV === 'development' && (
        <div className="space-y-3 p-4 bg-muted/20 rounded-lg border border-border/20">
          <div className="text-center">
            <p className="text-xs font-medium text-muted-foreground mb-2">
              Test Accounts (Development Only)
            </p>
            <div className="space-y-1 text-xs text-muted-foreground">
              <p>testuser@example.com / password123</p>
              <p>admin@test.com / admin123</p>
              <p>demo@demo.com / demo123</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LoginStep;