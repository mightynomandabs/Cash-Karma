// Image optimization utilities
export interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
}

// Lazy loading image component
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
}) => {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      sizes={sizes}
      onError={(e) => {
        // Fallback to placeholder on error
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder.svg';
      }}
    />
  );
};

// Avatar optimization
export const OptimizedAvatar: React.FC<{
  src: string;
  alt: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ src, alt, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  return (
    <img
      src={src}
      alt={alt}
      className={`${sizeClasses[size]} rounded-full object-cover ${className}`}
      loading="lazy"
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.src = '/placeholder.svg';
      }}
    />
  );
};

// Background image optimization
export const OptimizedBackground: React.FC<{
  src: string;
  alt?: string;
  className?: string;
  children: React.ReactNode;
}> = ({ src, alt, className = '', children }) => {
  return (
    <div
      className={`relative bg-cover bg-center bg-no-repeat ${className}`}
      style={{
        backgroundImage: `url(${src})`,
      }}
      role={alt ? 'img' : undefined}
      aria-label={alt}
    >
      {children}
    </div>
  );
};

// Image preloading utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Preload critical images
export const preloadCriticalImages = async () => {
  const criticalImages = [
    '/placeholder.svg',
    // Add other critical images here
  ];

  try {
    await Promise.all(criticalImages.map(preloadImage));
  } catch (error) {
    console.warn('Failed to preload some critical images:', error);
  }
};

// Responsive image sizes
export const getResponsiveSizes = (breakpoints: Record<string, number>) => {
  return Object.entries(breakpoints)
    .map(([breakpoint, width]) => `(min-width: ${breakpoint}) ${width}px`)
    .join(', ');
};

// Common responsive sizes
export const commonSizes = {
  avatar: getResponsiveSizes({
    '640px': 40,
    '768px': 48,
    '1024px': 56,
  }),
  card: getResponsiveSizes({
    '640px': 300,
    '768px': 400,
    '1024px': 500,
  }),
  hero: getResponsiveSizes({
    '640px': 600,
    '768px': 800,
    '1024px': 1200,
  }),
}; 