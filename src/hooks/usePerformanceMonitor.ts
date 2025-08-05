import { useCallback, useRef } from 'react';

interface PerformanceMetrics {
  averageSearchTime: number;
  totalSearches: number;
  cacheHitRate: number;
  slowSearches: number; // Searches > 100ms
  fastSearches: number; // Searches < 50ms
}

export const usePerformanceMonitor = () => {
  const metrics = useRef<PerformanceMetrics>({
    averageSearchTime: 0,
    totalSearches: 0,
    cacheHitRate: 0,
    slowSearches: 0,
    fastSearches: 0,
  });
  
  const searchTimes = useRef<number[]>([]);

  const recordSearchTime = useCallback((searchTime: number, wasCacheHit: boolean = false) => {
    if (!__DEV__) return; // Only track in development

    const current = metrics.current;
    
    // Update search times
    searchTimes.current.push(searchTime);
    if (searchTimes.current.length > 100) {
      searchTimes.current.shift(); // Keep only last 100 searches
    }

    // Update metrics
    current.totalSearches++;
    current.averageSearchTime = searchTimes.current.reduce((a, b) => a + b, 0) / searchTimes.current.length;
    
    if (searchTime > 100) {
      current.slowSearches++;
    } else if (searchTime < 50) {
      current.fastSearches++;
    }

    // Log performance warnings
    if (searchTime > 200) {
      console.warn(`🐌 Slow search detected: ${searchTime.toFixed(2)}ms`);
    } else if (searchTime < 10 && !wasCacheHit) {
      console.log(`⚡ Super fast search: ${searchTime.toFixed(2)}ms`);
    }

    // Log summary every 10 searches
    if (current.totalSearches % 10 === 0) {
      console.log(`📊 Search Performance Summary:
        🔍 Total Searches: ${current.totalSearches}
        ⏱️ Average Time: ${current.averageSearchTime.toFixed(2)}ms
        🚀 Fast Searches (<50ms): ${current.fastSearches}
        🐌 Slow Searches (>100ms): ${current.slowSearches}
        📈 Performance Score: ${getPerformanceScore()}%`
      );
    }
  }, []);

  const getPerformanceScore = useCallback((): number => {
    const current = metrics.current;
    if (current.totalSearches === 0) return 100;

    const fastRatio = current.fastSearches / current.totalSearches;
    const slowRatio = current.slowSearches / current.totalSearches;
    const avgTimeScore = Math.max(0, 100 - current.averageSearchTime);
    
    return Math.round(fastRatio * 40 + (1 - slowRatio) * 40 + avgTimeScore * 0.2);
  }, []);

  const getMetrics = useCallback((): PerformanceMetrics => {
    return { ...metrics.current };
  }, []);

  const resetMetrics = useCallback(() => {
    metrics.current = {
      averageSearchTime: 0,
      totalSearches: 0,
      cacheHitRate: 0,
      slowSearches: 0,
      fastSearches: 0,
    };
    searchTimes.current = [];
    console.log('📊 Performance metrics reset');
  }, []);

  return {
    recordSearchTime,
    getMetrics,
    getPerformanceScore,
    resetMetrics,
  };
};