import cashKarmaLogo from "@/assets/Cash Karma.png";

interface LogoProps {
  className?: string;
  size?: "sm" | "md" | "lg";
}

const Logo = ({ className = "", size = "md" }: LogoProps) => {
  const sizeClasses = {
    sm: "h-12 w-auto",
    md: "h-20 w-auto", 
    lg: "h-32 w-auto"
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      {/* Logo Icon - Cash Karma Logo Image */}
      <div className={`${sizeClasses[size]} flex items-center justify-center relative`}>
        <img 
          src={cashKarmaLogo} 
          alt="Cash Karma Logo" 
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
};

export default Logo;