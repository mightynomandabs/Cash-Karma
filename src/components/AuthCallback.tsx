import React, { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { CheckCircle, AlertCircle, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

export const AuthCallback: React.FC = () => {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          setStatus('error')
          setMessage('Authentication failed. Please try again.')
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Welcome to Cash Karma! Redirecting you...')
          
          // Redirect to dashboard after a brief delay
          setTimeout(() => {
            window.location.href = '/dashboard'
          }, 2000)
        } else {
          setStatus('error')
          setMessage('No session found. Please try signing in again.')
        }
      } catch (error) {
        console.error('Unexpected error during auth callback:', error)
        setStatus('error')
        setMessage('An unexpected error occurred. Please try again.')
      }
    }

    handleAuthCallback()
  }, [])

  const getStatusContent = () => {
    switch (status) {
      case 'loading':
        return (
          <div className="text-center space-y-6">
            <LoadingSpinner size="lg" />
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Completing Authentication
              </h2>
              <p className="text-muted-foreground">
                Please wait while we verify your magic link...
              </p>
            </div>
          </div>
        )

      case 'success':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl flex items-center justify-center border border-primary/20">
              <CheckCircle className="w-10 h-10 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Authentication Successful!
              </h2>
              <p className="text-muted-foreground">
                {message}
              </p>
            </div>
            {/* Animated sparkles */}
            <div className="relative">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "absolute w-2 h-2 rounded-full animate-pulse",
                    i % 2 === 0 ? "bg-primary" : "bg-accent"
                  )}
                  style={{
                    left: `${20 + (i * 12)}%`,
                    top: `${10 + (i % 2) * 20}%`,
                    animationDelay: `${i * 200}ms`,
                    animationDuration: "2s"
                  }}
                />
              ))}
            </div>
          </div>
        )

      case 'error':
        return (
          <div className="text-center space-y-6">
            <div className="w-20 h-20 mx-auto bg-gradient-to-br from-destructive/20 to-destructive/10 rounded-2xl flex items-center justify-center border border-destructive/20">
              <AlertCircle className="w-10 h-10 text-destructive" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-foreground">
                Authentication Failed
              </h2>
              <p className="text-muted-foreground">
                {message}
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="block w-full px-6 py-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                Back to Home
              </button>
            </div>
          </div>
        )
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-card">
      <div className="max-w-md mx-auto p-8">
        {getStatusContent()}
      </div>
    </div>
  )
} 