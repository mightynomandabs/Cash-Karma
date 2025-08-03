import React from 'react';
import { Loader2, Sparkles, Heart, Coins, Users, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';

// Basic loading spinner
export const LoadingSpinner: React.FC<{
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}> = ({ size = 'md', className }) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
    xl: 'w-12 h-12',
  };

  return (
    <Loader2 
      className={cn(
        'animate-spin text-primary',
        sizeClasses[size],
        className
      )} 
    />
  );
};

// Contextual loading states
export const PaymentLoading: React.FC<{ amount?: number }> = ({ amount }) => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="relative">
        <Coins className="w-12 h-12 text-primary animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg">Processing Payment</h3>
      {amount && (
        <p className="text-muted-foreground">
          Processing ₹{amount} payment...
        </p>
      )}
    </div>
    <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
      <Sparkles className="w-4 h-4" />
      <span>This usually takes 10-15 seconds</span>
    </div>
  </div>
);

export const DropLoading: React.FC = () => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="relative">
        <Heart className="w-12 h-12 text-red-500 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg">Sending Karma Drop</h3>
      <p className="text-muted-foreground">
        Spreading good vibes...
      </p>
    </div>
  </div>
);

export const ProfileLoading: React.FC = () => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="relative">
        <Users className="w-12 h-12 text-blue-500 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg">Loading Profile</h3>
      <p className="text-muted-foreground">
        Fetching your karma stats...
      </p>
    </div>
  </div>
);

export const LeaderboardLoading: React.FC = () => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="relative">
        <Trophy className="w-12 h-12 text-yellow-500 animate-pulse" />
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg">Loading Leaderboard</h3>
      <p className="text-muted-foreground">
        Finding the top karma givers...
      </p>
    </div>
  </div>
);

// Skeleton loaders
export const CardSkeleton: React.FC<{ className?: string }> = ({ className }) => (
  <div className={cn('animate-pulse', className)}>
    <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-muted rounded w-1/2 mb-4"></div>
    <div className="space-y-2">
      <div className="h-3 bg-muted rounded w-full"></div>
      <div className="h-3 bg-muted rounded w-5/6"></div>
      <div className="h-3 bg-muted rounded w-4/6"></div>
    </div>
  </div>
);

export const DropSkeleton: React.FC = () => (
  <div className="border rounded-lg p-4 animate-pulse">
    <div className="flex items-center gap-3 mb-3">
      <div className="w-10 h-10 bg-muted rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-muted rounded w-1/3 mb-1"></div>
        <div className="h-3 bg-muted rounded w-1/4"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-full"></div>
      <div className="h-4 bg-muted rounded w-3/4"></div>
    </div>
    <div className="flex justify-between items-center mt-3">
      <div className="h-6 bg-muted rounded w-16"></div>
      <div className="h-6 bg-muted rounded w-20"></div>
    </div>
  </div>
);

export const ProfileSkeleton: React.FC = () => (
  <div className="space-y-4 animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-16 h-16 bg-muted rounded-full"></div>
      <div className="flex-1">
        <div className="h-5 bg-muted rounded w-1/3 mb-2"></div>
        <div className="h-4 bg-muted rounded w-1/2"></div>
      </div>
    </div>
    <div className="grid grid-cols-3 gap-4">
      <div className="text-center">
        <div className="h-6 bg-muted rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
      </div>
      <div className="text-center">
        <div className="h-6 bg-muted rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
      </div>
      <div className="text-center">
        <div className="h-6 bg-muted rounded w-8 mx-auto mb-1"></div>
        <div className="h-3 bg-muted rounded w-12 mx-auto"></div>
      </div>
    </div>
  </div>
);

// Success states
export const SuccessMessage: React.FC<{
  title: string;
  message: string;
  icon?: React.ReactNode;
  onDismiss?: () => void;
}> = ({ title, message, icon, onDismiss }) => (
  <div className="text-center space-y-4">
    <div className="flex justify-center">
      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
        {icon || <Sparkles className="w-6 h-6 text-green-600" />}
      </div>
    </div>
    <div>
      <h3 className="font-semibold text-lg text-green-800">{title}</h3>
      <p className="text-muted-foreground">{message}</p>
    </div>
    {onDismiss && (
      <button
        onClick={onDismiss}
        className="text-sm text-primary hover:underline"
      >
        Continue
      </button>
    )}
  </div>
);

// Progress indicators
export const ProgressBar: React.FC<{
  progress: number;
  className?: string;
}> = ({ progress, className }) => (
  <div className={cn('w-full bg-muted rounded-full h-2', className)}>
    <div
      className="bg-primary h-2 rounded-full transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
    />
  </div>
);

export const StepProgress: React.FC<{
  currentStep: number;
  totalSteps: number;
  steps: string[];
}> = ({ currentStep, totalSteps, steps }) => (
  <div className="space-y-4">
    <div className="flex justify-between items-center">
      {steps.map((step, index) => (
        <div key={index} className="flex items-center">
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
              index < currentStep
                ? 'bg-primary text-primary-foreground'
                : index === currentStep
                ? 'bg-primary/20 text-primary border-2 border-primary'
                : 'bg-muted text-muted-foreground'
            )}
          >
            {index < currentStep ? '✓' : index + 1}
          </div>
          {index < steps.length - 1 && (
            <div
              className={cn(
                'flex-1 h-0.5 mx-2',
                index < currentStep ? 'bg-primary' : 'bg-muted'
              )}
            />
          )}
        </div>
      ))}
    </div>
    <div className="text-center">
      <p className="text-sm font-medium">
        Step {currentStep} of {totalSteps}
      </p>
      <p className="text-xs text-muted-foreground">
        {steps[currentStep - 1]}
      </p>
    </div>
  </div>
); 