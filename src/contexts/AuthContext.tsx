import React, { createContext, useContext, useEffect, useState } from 'react'
import { supabase, User, AuthError, signInWithGoogle } from '@/lib/supabase'
import { Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signInWithMagicLink: (email: string) => Promise<{ error: AuthError | null }>
  signInWithGoogle: () => Promise<{ data: any; error: AuthError | null }>
  signInWithTestCredentials: (username: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  updateUserProfile: (updates: Partial<User>) => Promise<{ error: AuthError | null }>
}

// Test user credentials (in a real app, these would be in environment variables)
const TEST_USERS = [
  {
    username: 'testuser@example.com',
    password: 'password123',
    user: {
      id: 'test-user-1',
      email: 'testuser@example.com',
      name: 'Test User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    username: 'admin@test.com',
    password: 'admin123',
    user: {
      id: 'test-admin-1',
      email: 'admin@test.com',
      name: 'Admin User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  },
  {
    username: 'demo@demo.com',
    password: 'demo123',
    user: {
      id: 'test-demo-1',
      email: 'demo@demo.com',
      name: 'Demo User',
      avatar_url: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    }
  }
]

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: React.ReactNode
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    const getInitialSession = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    }

    getInitialSession()

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event, session?.user?.email)
        setSession(session)
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const handleSignInWithMagicLink = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status
          }
        }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred. Please try again.',
          status: 500
        }
      }
    }
  }

  const handleSignInWithGoogle = async (): Promise<{ data: any; error: AuthError | null }> => {
    try {
      const { data, error } = await signInWithGoogle()
      
      if (error) {
        return {
          data: null,
          error: {
            message: error.message,
            status: error.status
          }
        }
      }

      return { data, error: null }
    } catch (error) {
      return {
        data: null,
        error: {
          message: 'An unexpected error occurred during Google sign-in.',
          status: 500
        }
      }
    }
  }

  const handleSignInWithTestCredentials = async (username: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      // Find matching test user
      const testUser = TEST_USERS.find(
        user => user.username === username && user.password === password
      )

      if (!testUser) {
        return {
          error: {
            message: 'Invalid test credentials. Please check your username and password.',
            status: 401
          }
        }
      }

      // Simulate authentication delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      // Set the test user as authenticated
      setUser(testUser.user)
      setSession({
        access_token: 'test-access-token',
        refresh_token: 'test-refresh-token',
        expires_in: 3600,
        token_type: 'bearer',
        user: testUser.user
      } as Session)

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'An unexpected error occurred during test authentication.',
          status: 500
        }
      }
    }
  }

  const signOut = async (): Promise<void> => {
    try {
      // If it's a test user, just clear the local state
      if (user?.id?.startsWith('test-')) {
        setUser(null)
        setSession(null)
        return
      }

      // Otherwise, use Supabase sign out
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error signing out:', error)
      }
    } catch (error) {
      console.error('Unexpected error during sign out:', error)
    }
  }

  const updateUserProfile = async (updates: Partial<User>): Promise<{ error: AuthError | null }> => {
    try {
      // For test users, update local state
      if (user?.id?.startsWith('test-')) {
        setUser({ ...user, ...updates })
        return { error: null }
      }

      // For real users, use Supabase
      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) {
        return {
          error: {
            message: error.message,
            status: error.status
          }
        }
      }

      return { error: null }
    } catch (error) {
      return {
        error: {
          message: 'Failed to update profile. Please try again.',
          status: 500
        }
      }
    }
  }

  const value: AuthContextType = {
    user,
    session,
    loading,
    signInWithMagicLink: handleSignInWithMagicLink,
    signInWithGoogle: handleSignInWithGoogle,
    signInWithTestCredentials: handleSignInWithTestCredentials,
    signOut,
    updateUserProfile
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}