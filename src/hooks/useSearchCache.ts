import { useCallback, useRef } from "react";

interface CacheEntry<T> {
  results: T[];
  timestamp: number;
  query: string;
}

export const useSearchCache = <T>(maxSize = 50, ttl = 300000) => {
  // 5 min TTL
  const cache = useRef<Map<string, CacheEntry<T>>>(new Map());
  const hitCount = useRef(0);
  const missCount = useRef(0);

  const get = useCallback(
    (key: string): T[] | null => {
      const entry = cache.current.get(key);
      if (!entry) {
        missCount.current++;
        return null;
      }

      if (Date.now() - entry.timestamp > ttl) {
        cache.current.delete(key);
        missCount.current++;
        return null;
      }

      hitCount.current++;
      //console.log(`💾 Cache HIT for "${key}" (${cache.current.size} entries, ${hitCount.current}/${hitCount.current + missCount.current} hit rate)`);
      return entry.results;
    },
    [ttl]
  );

  const set = useCallback(
    (key: string, results: T[]) => {
      // Clean old entries if cache is full
      if (cache.current.size >= maxSize) {
        const oldestKey = cache.current.keys().next().value;
        cache.current.delete(oldestKey);
        //console.log(`🗑️ Cache evicted oldest entry: ${oldestKey}`);
      }

      cache.current.set(key, {
        results: [...results], // Clone to prevent mutations
        timestamp: Date.now(),
        query: key,
      });

      //console.log(`💾 Cache SET for "${key}" with ${results.length} results (${cache.current.size}/${maxSize} entries)`);
    },
    [maxSize]
  );

  const clear = useCallback(() => {
    const size = cache.current.size;
    cache.current.clear();
    hitCount.current = 0;
    missCount.current = 0;
    //console.log(`🗑️ Cache cleared (${size} entries removed)`);
  }, []);

  const getStats = useCallback(() => {
    const total = hitCount.current + missCount.current;
    return {
      size: cache.current.size,
      hits: hitCount.current,
      misses: missCount.current,
      hitRate:
        total > 0 ? ((hitCount.current / total) * 100).toFixed(1) + "%" : "0%",
      entries: Array.from(cache.current.entries()).map(([key, value]) => ({
        query: key,
        resultsCount: value.results.length,
        age: Math.round((Date.now() - value.timestamp) / 1000) + "s",
      })),
    };
  }, []);

  return { get, set, clear, getStats };
};
