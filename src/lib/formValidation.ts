import { z } from 'zod';

// Common validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Password must contain at least one uppercase letter, one lowercase letter, and one number');

export const amountSchema = z
  .number()
  .min(1, 'Amount must be at least ₹1')
  .max(10000, 'Amount cannot exceed ₹10,000');

export const upiIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9._-]+@[a-zA-Z]{2,}$/, 'Please enter a valid UPI ID (e.g., name@bank)');

export const messageSchema = z
  .string()
  .min(1, 'Message is required')
  .max(500, 'Message cannot exceed 500 characters');

// Form-specific schemas
export const loginSchema = z.object({
  email: emailSchema,
});

export const dropCreationSchema = z.object({
  amount: amountSchema,
  message: messageSchema.optional(),
});

export const withdrawalSchema = z.object({
  amount: amountSchema,
  upiId: upiIdSchema,
});

export const profileUpdateSchema = z.object({
  displayName: z.string().min(1, 'Display name is required').max(50, 'Display name cannot exceed 50 characters'),
  avatar: z.string().optional(),
});

// Error handling utilities
export class FormError extends Error {
  constructor(
    message: string,
    public field?: string,
    public code?: string
  ) {
    super(message);
    this.name = 'FormError';
  }
}

export const handleFormError = (error: unknown): string => {
  if (error instanceof FormError) {
    return error.message;
  }
  
  if (error instanceof z.ZodError) {
    return error.errors[0]?.message || 'Invalid form data';
  }
  
  if (error instanceof Error) {
    // Handle specific error types
    if (error.message.includes('not authenticated')) {
      return 'Please log in to continue';
    }
    if (error.message.includes('network')) {
      return 'Network error. Please check your connection and try again';
    }
    if (error.message.includes('rate limit')) {
      return 'Too many requests. Please wait a moment and try again';
    }
    if (error.message.includes('payment')) {
      return 'Payment processing error. Please try again';
    }
    if (error.message.includes('database')) {
      return 'Server error. Please try again later';
    }
    return error.message;
  }
  
  return 'An unexpected error occurred. Please try again';
};

// Validation helpers
export const validateField = <T>(
  schema: z.ZodSchema<T>,
  value: unknown,
  fieldName?: string
): { isValid: boolean; error?: string } => {
  try {
    schema.parse(value);
    return { isValid: true };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { 
        isValid: false, 
        error: error.errors[0]?.message || `Invalid ${fieldName || 'field'}` 
      };
    }
    return { isValid: false, error: 'Validation failed' };
  }
};

// Async validation helpers
export const validateAsync = async <T>(
  validator: (value: T) => Promise<boolean>,
  value: T,
  errorMessage: string
): Promise<{ isValid: boolean; error?: string } => {
  try {
    const isValid = await validator(value);
    return { isValid, error: isValid ? undefined : errorMessage };
  } catch (error) {
    return { isValid: false, error: 'Validation failed' };
  }
};

// Form state management
export interface FormState<T> {
  data: T;
  errors: Partial<Record<keyof T, string>>;
  isSubmitting: boolean;
  isValid: boolean;
}

export const createFormState = <T>(initialData: T): FormState<T> => ({
  data: initialData,
  errors: {},
  isSubmitting: false,
  isValid: false,
});

export const updateFormState = <T>(
  state: FormState<T>,
  updates: Partial<FormState<T>>
): FormState<T> => ({
  ...state,
  ...updates,
});

// Success/Error message helpers
export const getSuccessMessage = (action: string): string => {
  const messages = {
    login: 'Login link sent! Check your email',
    drop: 'Karma drop sent successfully! 🎉',
    withdrawal: 'Withdrawal request submitted! 💰',
    profile: 'Profile updated successfully! ✨',
    avatar: 'Avatar updated successfully! 🎨',
  };
  return messages[action as keyof typeof messages] || 'Action completed successfully!';
};

export const getErrorMessage = (action: string, error: string): string => {
  const baseMessages = {
    login: 'Failed to send login link',
    drop: 'Failed to send karma drop',
    withdrawal: 'Failed to process withdrawal',
    profile: 'Failed to update profile',
    avatar: 'Failed to update avatar',
  };
  
  const baseMessage = baseMessages[action as keyof typeof baseMessages] || 'Action failed';
  return `${baseMessage}: ${error}`;
}; 