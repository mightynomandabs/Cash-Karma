import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { AuthCallback } from "@/components/AuthCallback";
import { UserDashboard } from "@/components/UserDashboard";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import CookieBanner from "@/components/CookieBanner";
import Navigation from "@/components/Navigation";
import StickyActionBar from "@/components/StickyCTA";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import WalletPage from "./components/WalletPage";
import TestingSuite from "./components/TestingSuite";
import PerformanceMonitor from "./components/PerformanceMonitor";
import { initializeAnalytics, trackUserAction } from "@/lib/analytics";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 2,
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
    },
    mutations: {
      retry: 1,
    },
  },
});

const App = () => {
  // Initialize analytics
  React.useEffect(() => {
    initializeAnalytics();
  }, []);

  // Global error handler for unhandled promise rejections
  React.useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      console.error('Unhandled promise rejection:', event.reason);
      trackUserAction.errorOccurred(
        event.reason?.message || 'Unknown error',
        'unhandled_rejection'
      );
    };

    const handleGlobalError = (event: ErrorEvent) => {
      console.error('Global error:', event.error);
      trackUserAction.errorOccurred(
        event.error?.message || 'Unknown error',
        'global_error'
      );
    };

    window.addEventListener('unhandledrejection', handleUnhandledRejection);
    window.addEventListener('error', handleGlobalError);

    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection);
      window.removeEventListener('error', handleGlobalError);
    };
  }, []);

  // Handle cookie consent
  const handleCookieAccept = () => {
    trackUserAction.featureUsed('cookie_consent', 'accepted');
    // Initialize analytics tracking if user accepts cookies
    // This could enable more detailed tracking
  };

  const handleCookieDecline = () => {
    trackUserAction.featureUsed('cookie_consent', 'declined');
    // Disable analytics tracking if user declines cookies
  };

  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                
                {/* Authentication Routes */}
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/dashboard" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <UserDashboard />
                      <StickyActionBar />
                    </>
                  </ProtectedRoute>
                } />
                
                {/* Protected Routes */}
                <Route path="/wallet" element={
                  <ProtectedRoute>
                    <>
                      <Navigation />
                      <WalletPage />
                      <StickyActionBar />
                    </>
                  </ProtectedRoute>
                } />
                
                {/* Testing Routes */}
                <Route path="/testing" element={
                  <ProtectedRoute>
                    <TestingSuite />
                  </ProtectedRoute>
                } />
                
                <Route path="/performance" element={
                  <ProtectedRoute>
                    <PerformanceMonitor />
                  </ProtectedRoute>
                } />
                
                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              
              {/* Cookie Banner */}
              <CookieBanner 
                onAccept={handleCookieAccept}
                onDecline={handleCookieDecline}
              />
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
};

export default App;
