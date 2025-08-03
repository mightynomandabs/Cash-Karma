import { useState, useEffect, useRef, ReactNode } from "react";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
  threshold?: number;
}

const AnimatedSection = ({ 
  children, 
  className = "", 
  delay = 0, 
  direction = 'up',
  threshold = 0.1 
}: AnimatedSectionProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setIsVisible(true);
          setHasAnimated(true);
        }
      },
      {
        threshold,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [threshold, hasAnimated]);

  const getTransformClass = () => {
    const baseClass = "transition-all duration-1000 ease-out";
    const transformMap = {
      up: "translate-y-8 opacity-0",
      down: "-translate-y-8 opacity-0",
      left: "translate-x-8 opacity-0",
      right: "-translate-x-8 opacity-0"
    };
    
    return isVisible 
      ? `${baseClass} translate-y-0 translate-x-0 opacity-100` 
      : `${baseClass} ${transformMap[direction]}`;
  };

  return (
    <div 
      ref={ref}
      className={`${className} ${getTransformClass()}`}
      style={{ 
        transitionDelay: `${delay}ms`,
        willChange: 'transform, opacity'
      }}
    >
      {children}
    </div>
  );
};

export default AnimatedSection; 