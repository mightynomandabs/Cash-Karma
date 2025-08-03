import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Gauge, Clock, Zap, HardDrive, Wifi, Activity } from 'lucide-react';
import { trackPerformance } from '@/lib/analytics';

interface PerformanceMetrics {
  pageLoadTime: number;
  domContentLoaded: number;
  firstContentfulPaint: number;
  largestContentfulPaint: number;
  cumulativeLayoutShift: number;
  firstInputDelay: number;
  memoryUsage?: number;
  networkRequests: number;
  imageCount: number;
  scriptCount: number;
  styleCount: number;
}

const PerformanceMonitor: React.FC = () => {
  const [metrics, setMetrics] = useState<PerformanceMetrics | null>(null);
  const [isMonitoring, setIsMonitoring] = useState(false);
  const [history, setHistory] = useState<PerformanceMetrics[]>([]);

  const getPerformanceMetrics = (): PerformanceMetrics => {
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
    const paint = performance.getEntriesByType('paint');
    const layoutShift = performance.getEntriesByType('layout-shift');
    const firstInput = performance.getEntriesByType('first-input');

    const firstContentfulPaint = paint.find(entry => entry.name === 'first-contentful-paint')?.startTime || 0;
    const largestContentfulPaint = performance.getEntriesByType('largest-contentful-paint')[0]?.startTime || 0;
    const cumulativeLayoutShift = layoutShift.reduce((sum, entry) => sum + (entry as any).value, 0);
    const firstInputDelay = firstInput[0]?.processingStart ? 
      (firstInput[0] as any).processingStart - (firstInput[0] as any).startTime : 0;

    // Count resources
    const resources = performance.getEntriesByType('resource');
    const images = resources.filter(r => r.initiatorType === 'img');
    const scripts = resources.filter(r => r.initiatorType === 'script');
    const styles = resources.filter(r => r.initiatorType === 'link');

    return {
      pageLoadTime: navigation.loadEventEnd - navigation.loadEventStart,
      domContentLoaded: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
      firstContentfulPaint,
      largestContentfulPaint,
      cumulativeLayoutShift,
      firstInputDelay,
      memoryUsage: (performance as any).memory?.usedJSHeapSize,
      networkRequests: resources.length,
      imageCount: images.length,
      scriptCount: scripts.length,
      styleCount: styles.length,
    };
  };

  const startMonitoring = () => {
    setIsMonitoring(true);
    const metrics = getPerformanceMetrics();
    setMetrics(metrics);
    setHistory(prev => [...prev, metrics]);
    
    // Track performance metrics
    trackPerformance.pageLoad(metrics.pageLoadTime, window.location.pathname);
  };

  const stopMonitoring = () => {
    setIsMonitoring(false);
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const getPerformanceScore = (metrics: PerformanceMetrics): number => {
    let score = 100;
    
    // Deduct points for slow loading
    if (metrics.pageLoadTime > 3000) score -= 20;
    if (metrics.firstContentfulPaint > 2000) score -= 15;
    if (metrics.largestContentfulPaint > 4000) score -= 15;
    
    // Deduct points for poor layout stability
    if (metrics.cumulativeLayoutShift > 0.1) score -= 10;
    
    // Deduct points for slow interactivity
    if (metrics.firstInputDelay > 100) score -= 10;
    
    // Deduct points for too many resources
    if (metrics.networkRequests > 50) score -= 10;
    
    return Math.max(0, score);
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getScoreBadge = (score: number): string => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  useEffect(() => {
    // Auto-start monitoring on mount
    startMonitoring();
  }, []);

  if (!metrics) return null;

  const score = getPerformanceScore(metrics);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Performance Monitor</h1>
          <p className="text-muted-foreground">
            Real-time performance metrics and monitoring
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={isMonitoring ? stopMonitoring : startMonitoring}
            variant={isMonitoring ? "destructive" : "default"}
            className="flex items-center gap-2"
          >
            <Activity className="w-4 h-4" />
            {isMonitoring ? 'Stop Monitoring' : 'Start Monitoring'}
          </Button>
          <Button
            onClick={clearHistory}
            variant="outline"
            size="sm"
          >
            Clear History
          </Button>
        </div>
      </div>

      {/* Performance Score */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Gauge className="w-5 h-5" />
            Performance Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <div className={`text-4xl font-bold ${getScoreColor(score)}`}>
              {score}
            </div>
            <div className="flex-1">
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    score >= 90 ? 'bg-green-500' : 
                    score >= 70 ? 'bg-yellow-500' : 'bg-red-500'
                  }`}
                  style={{ width: `${score}%` }}
                />
              </div>
            </div>
            <Badge className={getScoreBadge(score)}>
              {score >= 90 ? 'Excellent' : score >= 70 ? 'Good' : 'Needs Improvement'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Clock className="w-4 h-4" />
              Load Times
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Page Load:</span>
              <span className="font-medium">{metrics.pageLoadTime.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">DOM Ready:</span>
              <span className="font-medium">{metrics.domContentLoaded.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">First Paint:</span>
              <span className="font-medium">{metrics.firstContentfulPaint.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Largest Paint:</span>
              <span className="font-medium">{metrics.largestContentfulPaint.toFixed(0)}ms</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <Zap className="w-4 h-4" />
              Interactivity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">First Input Delay:</span>
              <span className="font-medium">{metrics.firstInputDelay.toFixed(0)}ms</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Layout Shift:</span>
              <span className="font-medium">{(metrics.cumulativeLayoutShift * 100).toFixed(2)}%</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              <HardDrive className="w-4 h-4" />
              Resources
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Total Requests:</span>
              <span className="font-medium">{metrics.networkRequests}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Images:</span>
              <span className="font-medium">{metrics.imageCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Scripts:</span>
              <span className="font-medium">{metrics.scriptCount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Styles:</span>
              <span className="font-medium">{metrics.styleCount}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* History */}
      {history.length > 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Performance History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {history.slice(-5).reverse().map((entry, index) => (
                <div key={index} className="flex items-center justify-between p-2 border rounded">
                  <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">
                      {new Date().toLocaleTimeString()}
                    </span>
                    <span className="text-sm">
                      Load: {entry.pageLoadTime.toFixed(0)}ms
                    </span>
                    <span className="text-sm">
                      Score: {getPerformanceScore(entry)}
                    </span>
                  </div>
                  <Badge className={getScoreBadge(getPerformanceScore(entry))}>
                    {getPerformanceScore(entry)}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default PerformanceMonitor; 