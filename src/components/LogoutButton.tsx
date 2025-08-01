import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    signOut();
    navigate('/');
  };

  if (!user) return null;

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={handleLogout}
      className="text-muted-foreground hover:text-foreground transition-colors"
    >
      <LogOut className="w-4 h-4 mr-2" />
      Logout
    </Button>
  );
};

export default LogoutButton; 