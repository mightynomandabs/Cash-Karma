import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://pcvrqiogqnrmekbjmdsf.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdnJxaW9ncW5ybWVrYmptZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzY4NDgsImV4cCI6MjA2OTU1Mjg0OH0.d4TH8MsHEXsS-Zwc-GDrpElt17CnwMQ8C9WhIsb_zcI'

// Google OAuth Configuration - Use environment variables
const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = import.meta.env.VITE_GOOGLE_CLIENT_SECRET

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// Type definitions for better TypeScript support
export interface User {
  id: string
  email?: string
  user_metadata?: {
    display_name?: string
    avatar_url?: string
  }
}

export interface AuthError {
  message: string
  status?: number
}

export interface AuthResponse {
  user: User | null
  error: AuthError | null
}

// Google OAuth helper functions
export const signInWithGoogle = async () => {
  // Check if Google OAuth is properly configured
  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    console.warn('Google OAuth not configured. Please set VITE_GOOGLE_CLIENT_ID in your environment variables.');
    return {
      data: null,
      error: {
        message: 'Google OAuth is not configured. Please contact support.',
        status: 500
      }
    };
  }

  try {
    // Get the current origin (works for both development and production)
    const currentOrigin = window.location.origin;
    const redirectUrl = `${currentOrigin}/auth/callback`;
    
    console.log('Google OAuth redirect URL:', redirectUrl);
    
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl
      }
    })
    return { data, error }
  } catch (error) {
    console.error('Google OAuth error:', error);
    return {
      data: null,
      error: {
        message: 'Failed to initiate Google sign-in. Please try again.',
        status: 500
      }
    };
  }
}

export const getGoogleAuthUrl = () => {
  return `${supabaseUrl}/auth/v1/authorize?provider=google&client_id=${supabaseAnonKey}&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`
} 