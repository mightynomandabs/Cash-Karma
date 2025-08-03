// Performance monitoring utilities with accurate timing
export interface PerformanceMetrics {
  domContentLoaded: number;
  fullLoad: number;
  navigationLoad?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

export class PerformanceMonitor {
  private startTime: number;
  private metrics: PerformanceMetrics;

  constructor() {
    this.startTime = performance.now();
    this.metrics = {
      domContentLoaded: 0,
      fullLoad: 0,
    };
  }

  // Track DOM content loaded
  trackDOMContentLoaded(): void {
    this.metrics.domContentLoaded = performance.now() - this.startTime;
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded.toFixed(2), 'ms');
  }

  // Track full page load
  trackFullLoad(): void {
    this.metrics.fullLoad = performance.now() - this.startTime;
    console.log('Full Page Load Time:', this.metrics.fullLoad.toFixed(2), 'ms');
  }

  // Get navigation timing data
  getNavigationTiming(): number | null {
    if ('performance' in window) {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData && perfData.loadEventEnd > 0) {
        this.metrics.navigationLoad = perfData.loadEventEnd - perfData.navigationStart;
        return this.metrics.navigationLoad;
      }
    }
    return null;
  }

  // Get First Contentful Paint
  getFirstContentfulPaint(): number | null {
    if ('performance' in window) {
      const paintEntries = performance.getEntriesByType('paint');
      const fcpEntry = paintEntries.find(entry => entry.name === 'first-contentful-paint');
      if (fcpEntry) {
        this.metrics.firstContentfulPaint = fcpEntry.startTime;
        return this.metrics.firstContentfulPaint;
      }
    }
    return null;
  }

  // Get Largest Contentful Paint
  getLargestContentfulPaint(): number | null {
    if ('performance' in window) {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) {
        const lcpEntry = lcpEntries[lcpEntries.length - 1];
        this.metrics.largestContentfulPaint = lcpEntry.startTime;
        return this.metrics.largestContentfulPaint;
      }
    }
    return null;
  }

  // Get all metrics
  getAllMetrics(): PerformanceMetrics {
    return { ...this.metrics };
  }

  // Log comprehensive performance report
  logPerformanceReport(): void {
    const navTime = this.getNavigationTiming();
    const fcp = this.getFirstContentfulPaint();
    const lcp = this.getLargestContentfulPaint();

    console.group('🚀 Performance Report');
    console.log('DOM Content Loaded:', this.metrics.domContentLoaded.toFixed(2), 'ms');
    console.log('Full Page Load:', this.metrics.fullLoad.toFixed(2), 'ms');
    if (navTime) console.log('Navigation Load:', navTime.toFixed(2), 'ms');
    if (fcp) console.log('First Contentful Paint:', fcp.toFixed(2), 'ms');
    if (lcp) console.log('Largest Contentful Paint:', lcp.toFixed(2), 'ms');
    console.groupEnd();
  }
}

// Global performance monitor instance
export const performanceMonitor = new PerformanceMonitor();

// Initialize performance monitoring
export const initializePerformanceMonitoring = (): void => {
  // Track DOM content loaded
  document.addEventListener('DOMContentLoaded', () => {
    performanceMonitor.trackDOMContentLoaded();
  });

  // Track full page load
  window.addEventListener('load', () => {
    performanceMonitor.trackFullLoad();
    performanceMonitor.logPerformanceReport();
  });

  // Track First Contentful Paint
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name === 'first-contentful-paint') {
          performanceMonitor.getFirstContentfulPaint();
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['paint'] });
    } catch (e) {
      // Paint timing not supported
    }
  }

  // Track Largest Contentful Paint
  if ('performance' in window) {
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === 'largest-contentful-paint') {
          performanceMonitor.getLargestContentfulPaint();
        }
      }
    });
    
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      // LCP not supported
    }
  }
};

// Utility function for timing async operations
export const timeAsyncOperation = async <T>(
  operation: () => Promise<T>,
  operationName: string = 'Async Operation'
): Promise<T> => {
  const startTime = performance.now();
  try {
    const result = await operation();
    const duration = performance.now() - startTime;
    console.log(`${operationName} completed in:`, duration.toFixed(2), 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`${operationName} failed after:`, duration.toFixed(2), 'ms');
    throw error;
  }
};

// Utility function for timing synchronous operations
export const timeSyncOperation = <T>(
  operation: () => T,
  operationName: string = 'Sync Operation'
): T => {
  const startTime = performance.now();
  try {
    const result = operation();
    const duration = performance.now() - startTime;
    console.log(`${operationName} completed in:`, duration.toFixed(2), 'ms');
    return result;
  } catch (error) {
    const duration = performance.now() - startTime;
    console.error(`${operationName} failed after:`, duration.toFixed(2), 'ms');
    throw error;
  }
}; 