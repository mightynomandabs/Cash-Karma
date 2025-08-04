// Analytics tracking utilities
export interface AnalyticsEvent {
  event: string;
  properties?: Record<string, any>;
  userId?: string;
  timestamp?: number;
}

export interface PageView {
  path: string;
  title: string;
  referrer?: string;
  userId?: string;
}

// Analytics provider interface
export interface AnalyticsProvider {
  trackEvent(event: AnalyticsEvent): void;
  trackPageView(pageView: PageView): void;
  identify(userId: string, traits?: Record<string, any>): void;
  setUserProperties(properties: Record<string, any>): void;
}

// Simple analytics implementation
class SimpleAnalytics implements AnalyticsProvider {
  private events: AnalyticsEvent[] = [];
  private pageViews: PageView[] = [];
  private userProperties: Record<string, any> = {};

  trackEvent(event: AnalyticsEvent): void {
    const enrichedEvent = {
      ...event,
      timestamp: event.timestamp || Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    this.events.push(enrichedEvent);
    
    // Send to analytics service (if configured)
    this.sendToAnalytics(enrichedEvent);
    
    // Log for development
    if (import.meta.env.DEV) {
      console.log('Analytics Event:', enrichedEvent);
    }
  }

  trackPageView(pageView: PageView): void {
    const enrichedPageView = {
      ...pageView,
      timestamp: Date.now(),
      sessionId: this.getSessionId(),
      userAgent: navigator.userAgent,
    };

    this.pageViews.push(enrichedPageView);
    
    // Send to analytics service
    this.sendToAnalytics({
      event: 'page_view',
      properties: enrichedPageView,
    });
    
    if (import.meta.env.DEV) {
      console.log('Page View:', enrichedPageView);
    }
  }

  identify(userId: string, traits?: Record<string, any>): void {
    this.userProperties = { ...this.userProperties, ...traits, userId };
    
    this.trackEvent({
      event: 'user_identified',
      properties: { userId, traits },
      userId,
    });
  }

  setUserProperties(properties: Record<string, any>): void {
    this.userProperties = { ...this.userProperties, ...properties };
  }

  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  private sendToAnalytics(event: AnalyticsEvent): void {
    // In a real implementation, this would send to your analytics service
    // For now, we'll just store locally
    const analyticsData = JSON.parse(localStorage.getItem('analytics_data') || '[]');
    analyticsData.push(event);
    localStorage.setItem('analytics_data', JSON.stringify(analyticsData.slice(-1000))); // Keep last 1000 events
  }

  // Get analytics data for debugging
  getAnalyticsData(): { events: AnalyticsEvent[]; pageViews: PageView[] } {
    return {
      events: this.events,
      pageViews: this.pageViews,
    };
  }
}

// Global analytics instance
export const analytics = new SimpleAnalytics();

// Event tracking helpers
export const trackEvent = (event: string, properties?: Record<string, any>, userId?: string) => {
  analytics.trackEvent({ event, properties, userId });
};

export const trackPageView = (path: string, title: string, referrer?: string, userId?: string) => {
  analytics.trackPageView({ path, title, referrer, userId });
};

// Specific event tracking functions
export const trackUserAction = {
  // Authentication events
  loginAttempt: (method: string) => trackEvent('login_attempt', { method }),
  loginSuccess: (method: string) => trackEvent('login_success', { method }),
  loginFailure: (method: string, error: string) => trackEvent('login_failure', { method, error }),
  logout: () => trackEvent('logout'),

  // Drop events
  dropCreated: (amount: number, hasMessage: boolean) => 
    trackEvent('drop_created', { amount, hasMessage }),
  dropReceived: (amount: number, fromAnonymous: boolean) => 
    trackEvent('drop_received', { amount, fromAnonymous }),
  dropReaction: (reactionType: string) => 
    trackEvent('drop_reaction', { reactionType }),

  // Wallet events
  withdrawalRequested: (amount: number) => 
    trackEvent('withdrawal_requested', { amount }),
  withdrawalCompleted: (amount: number) => 
    trackEvent('withdrawal_completed', { amount }),
  withdrawalFailed: (amount: number, error: string) => 
    trackEvent('withdrawal_failed', { amount, error }),

  // Profile events
  profileUpdated: (fields: string[]) => 
    trackEvent('profile_updated', { fields }),
  avatarChanged: (avatarType: string) => 
    trackEvent('avatar_changed', { avatarType }),

  // Social events
  leaderboardViewed: () => trackEvent('leaderboard_viewed'),
  socialShare: (platform: string, contentType: string) => 
    trackEvent('social_share', { platform, contentType }),

  // Feature usage
  featureUsed: (feature: string, context?: string) => 
    trackEvent('feature_used', { feature, context }),
  
  // Error events
  errorOccurred: (error: string, context: string) => 
    trackEvent('error_occurred', { error, context }),
};

// Performance tracking
export const trackPerformance = {
  pageLoad: (loadTime: number, path: string) => 
    trackEvent('page_load', { loadTime, path }),
  
  apiCall: (endpoint: string, duration: number, success: boolean) => 
    trackEvent('api_call', { endpoint, duration, success }),
  
  imageLoad: (src: string, loadTime: number) => 
    trackEvent('image_load', { src, loadTime }),
};

// User behavior tracking
export const trackUserBehavior = {
  scrollDepth: (depth: number, path: string) => 
    trackEvent('scroll_depth', { depth, path }),
  
  timeOnPage: (duration: number, path: string) => 
    trackEvent('time_on_page', { duration, path }),
  
  buttonClick: (buttonId: string, context: string) => 
    trackEvent('button_click', { buttonId, context }),
  
  formInteraction: (formId: string, action: 'start' | 'complete' | 'abandon') => 
    trackEvent('form_interaction', { formId, action }),
};

// Conversion tracking
export const trackConversion = {
  dropSent: (amount: number, isFirstTime: boolean) => 
    trackEvent('conversion_drop_sent', { amount, isFirstTime }),
  
  walletCreated: (userId: string) => 
    trackEvent('conversion_wallet_created', { userId }),
  
  withdrawalCompleted: (amount: number, userId: string) => 
    trackEvent('conversion_withdrawal_completed', { amount, userId }),
};

// Initialize analytics
export const initializeAnalytics = () => {
  // Track initial page view
  trackPageView(
    window.location.pathname,
    document.title,
    document.referrer
  );

  // Track performance metrics
  if ('performance' in window) {
    const pageLoadStartTime = performance.now();
    
    window.addEventListener('load', () => {
      const fullLoadTime = performance.now() - pageLoadStartTime;
      
      // Track the accurate load time
      trackPerformance.pageLoad(fullLoadTime, window.location.pathname);
      
      // Also track navigation timing if available
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData && perfData.loadEventEnd > 0) {
        const navigationLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        trackEvent('navigation_load_time', { 
          navigationLoadTime, 
          fullLoadTime,
          path: window.location.pathname 
        });
      }
    });
  }

  // Track scroll depth
  let maxScrollDepth = 0;
  window.addEventListener('scroll', () => {
    const scrollDepth = Math.round(
      (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    );
    if (scrollDepth > maxScrollDepth) {
      maxScrollDepth = scrollDepth;
      if (scrollDepth % 25 === 0) { // Track at 25%, 50%, 75%, 100%
        trackUserBehavior.scrollDepth(scrollDepth, window.location.pathname);
      }
    }
  });

  // Track time on page
  const startTime = Date.now();
  window.addEventListener('beforeunload', () => {
    const timeOnPage = Date.now() - startTime;
    trackUserBehavior.timeOnPage(timeOnPage, window.location.pathname);
  });
};

// Export for use in components
export default analytics; 