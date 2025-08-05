import { useCallback, useRef } from "react";
import { useAnalytics } from "./useAnalytics";

interface PerformanceMetrics {
  averageSearchTime: number;
  totalSearches: number;
  cacheHitRate: number;
  slowSearches: number; // Searches > 100ms
  fastSearches: number; // Searches < 50ms
}

export const usePerformanceMonitor = () => {
  const analytics = useAnalytics();
  const metrics = useRef<PerformanceMetrics>({
    averageSearchTime: 0,
    totalSearches: 0,
    cacheHitRate: 0,
    slowSearches: 0,
    fastSearches: 0,
  });

  const searchTimes = useRef<number[]>([]);

  const getPerformanceScore = useCallback((): number => {
    const current = metrics.current;
    if (current.totalSearches === 0) return 100;

    const fastRatio = current.fastSearches / current.totalSearches;
    const slowRatio = current.slowSearches / current.totalSearches;
    const avgTimeScore = Math.max(0, 100 - current.averageSearchTime);

    return Math.round(
      fastRatio * 40 + (1 - slowRatio) * 40 + avgTimeScore * 0.2
    );
  }, []);

  const recordSearchTime = useCallback(
    (
      searchTime: number,
      wasCacheHit: boolean = false,
      query?: string,
      resultsCount?: number
    ) => {
      const current = metrics.current;

      // Update search times
      searchTimes.current.push(searchTime);
      if (searchTimes.current.length > 100) {
        searchTimes.current.shift(); // Keep only last 100 searches
      }

      // Update metrics
      current.totalSearches++;
      current.averageSearchTime =
        searchTimes.current.reduce((a, b) => a + b, 0) /
        searchTimes.current.length;

      if (searchTime > 200) {
        current.slowSearches++;
      } else if (searchTime < 100) {
        current.fastSearches++;
      }

      // Send performance analytics
      if (query) {
        analytics.logSearchPerformance({
          query,
          searchTime,
          resultsCount: resultsCount || 0,
          cacheHit: wasCacheHit,
          searchType: "general",
        });
      }

      // Log performance warnings and send analytics for issues  
      if (searchTime > 500) {
        console.warn(`🐌 Slow search detected: ${searchTime.toFixed(2)}ms`);
        analytics.logEvent("performance_issue_detected", {
          issue_type: "slow_search",
          search_time: searchTime,
          query: query || "unknown",
          cache_hit: wasCacheHit,
          average_time: current.averageSearchTime,
        });
      } else if (searchTime < 10 && !wasCacheHit) {
        //console.log(`⚡ Super fast search: ${searchTime.toFixed(2)}ms`);
      }

      // Send periodic performance summary (every 50 searches)
      if (current.totalSearches % 50 === 0) {
        analytics.logEvent("performance_summary", {
          total_searches: current.totalSearches,
          average_search_time: current.averageSearchTime,
          slow_searches: current.slowSearches,
          fast_searches: current.fastSearches,
          performance_score: getPerformanceScore(),
        });
      }
    },
    [analytics, getPerformanceScore]
  );

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
    //console.log('📊 Performance metrics reset');
  }, []);

  return {
    recordSearchTime,
    getMetrics,
    getPerformanceScore,
    resetMetrics,
  };
};
