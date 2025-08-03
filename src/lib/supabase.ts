import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://pcvrqiogqnrmekbjmdsf.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseAnonKey) {
  throw new Error('NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable is required')
}

// Google OAuth Configuration - Use environment variables
const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET

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
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/auth/callback`
    }
  })
  return { data, error }
}

export const getGoogleAuthUrl = () => {
  return `${supabaseUrl}/auth/v1/authorize?provider=google&client_id=${supabaseAnonKey}&redirect_to=${encodeURIComponent(window.location.origin + '/auth/callback')}`
} 