import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://pcvrqiogqnrmekbjmdsf.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBjdnJxaW9ncW5ybWVrYmptZHNmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM5NzY4NDgsImV4cCI6MjA2OTU1Mjg0OH0.d4TH8MsHEXsS-Zwc-GDrpElt17CnwMQ8C9WhIsb_zcI'

// Google OAuth Configuration
const GOOGLE_CLIENT_ID = '292429606594-o0uq25qn7r30tlaerl1c0ot5s5bv32tm.apps.googleusercontent.com'
const GOOGLE_CLIENT_SECRET = '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'

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