import { useMemo, useState, useCallback, useRef } from "react";
import { Drug } from "./useDrugsData";
import { useSearchCache } from "./useSearchCache";
import { usePerformanceMonitor } from "./usePerformanceMonitor";

interface SearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy";
  matchedField: "tradename" | "activeingredient";
}

interface SearchIndex {
  id: number;
  tradename: string;
  activeingredient: string;
  tradenameWords: string[];
  ingredientWords: string[];
  drug: Drug;
}

export const useOptimizedSearch = (drugs: Drug[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const cancelRef = useRef<boolean>(false);
  const { get: getCachedResults, set: setCachedResults } = useSearchCache<SearchResult>();
  const { recordSearchTime } = usePerformanceMonitor();

  // Create search index once - this is the key optimization
  const searchIndex = useMemo<SearchIndex[]>(() => {
    console.log("🏗️ Building optimized search index...");
    const startTime = performance.now();
    
    const index = drugs.map((drug) => ({
      id: drug.id,
      tradename: drug.tradename?.toLowerCase() ?? "",
      activeingredient: drug.activeingredient?.toLowerCase() ?? "",
      tradenameWords: drug.tradename?.toLowerCase().split(/\s+/) ?? [],
      ingredientWords: drug.activeingredient?.toLowerCase().split(/\s+/) ?? [],
      drug,
    }));
    
    const endTime = performance.now();
    console.log(`📊 Search index built in ${(endTime - startTime).toFixed(2)}ms for ${drugs.length} drugs`);
    return index;
  }, [drugs]);

  const performOptimizedSearch = useCallback(async (query: string) => {
    if (!query.trim() || query.trim().length < 2) {
      setResults([]);
      return;
    }

    const searchTerm = query.toLowerCase().trim();
    
    // Check cache first
    const cacheStartTime = performance.now();
    const cachedResults = getCachedResults(searchTerm);
    if (cachedResults) {
      const cacheTime = performance.now() - cacheStartTime;
      recordSearchTime(cacheTime, true);
      setResults(cachedResults);
      return;
    }

    setIsLoading(true);
    cancelRef.current = false;

    const searchStartTime = performance.now();
    const exactMatches: SearchResult[] = [];
    const fuzzyMatches: SearchResult[] = [];

    // Phase 1: Fast exact matching (most performance-critical)
    for (let i = 0; i < searchIndex.length && !cancelRef.current; i++) {
      const item = searchIndex[i];
      
      // Exact tradename match (highest priority)
      if (item.tradename.includes(searchTerm)) {
        const score = item.tradename.startsWith(searchTerm) ? 1.0 : 0.8;
        exactMatches.push({
          drug: item.drug,
          score,
          matchType: "exact",
          matchedField: "tradename"
        });
      }
      // Exact ingredient match
      else if (item.activeingredient.includes(searchTerm)) {
        exactMatches.push({
          drug: item.drug,
          score: 0.6,
          matchType: "exact",
          matchedField: "activeingredient"
        });
      }

      // Early termination if we have enough exact matches
      if (exactMatches.length >= 20) {
        console.log(`⚡ Early termination: Found ${exactMatches.length} exact matches after ${i + 1} iterations`);
        break;
      }
    }

    // If we have good exact matches, return them immediately
    if (exactMatches.length >= 5) {
      const sortedResults = exactMatches
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
      
      setResults(sortedResults);
      setCachedResults(searchTerm, sortedResults);
      setIsLoading(false);
      
      const searchEndTime = performance.now();
      const searchTime = searchEndTime - searchStartTime;
      recordSearchTime(searchTime);
      console.log(`🔍 Fast exact search completed in ${searchTime.toFixed(2)}ms with ${sortedResults.length} results`);
      return;
    }

    // Phase 2: Fuzzy matching only if needed
    if (exactMatches.length < 5 && !cancelRef.current) {
      console.log("🔮 Performing fuzzy search as fallback...");
      const queryWords = searchTerm.split(/\s+/);
      
      for (let i = 0; i < searchIndex.length && !cancelRef.current; i++) {
        const item = searchIndex[i];
        
        // Word-based fuzzy matching (faster than character-level)
        const tradenameScore = calculateWordMatchScore(queryWords, item.tradenameWords);
        const ingredientScore = calculateWordMatchScore(queryWords, item.ingredientWords);
        
        if (tradenameScore > 0.3) {
          fuzzyMatches.push({
            drug: item.drug,
            score: tradenameScore,
            matchType: "fuzzy",
            matchedField: "tradename"
          });
        } else if (ingredientScore > 0.2) {
          fuzzyMatches.push({
            drug: item.drug,
            score: ingredientScore,
            matchType: "fuzzy",
            matchedField: "activeingredient"
          });
        }

        // Early termination for fuzzy search too
        if (fuzzyMatches.length >= 10) {
          console.log(`🔮 Fuzzy search early termination: Found ${fuzzyMatches.length} matches after ${i + 1} iterations`);
          break;
        }
      }
    }

    if (!cancelRef.current) {
      const allResults = [...exactMatches, ...fuzzyMatches]
        .sort((a, b) => b.score - a.score)
        .slice(0, 15);
      
      setResults(allResults);
      setCachedResults(searchTerm, allResults);
      
      const searchEndTime = performance.now();
      const searchTime = searchEndTime - searchStartTime;
      recordSearchTime(searchTime);
      console.log(`🎯 Complete search finished in ${searchTime.toFixed(2)}ms with ${allResults.length} results (${exactMatches.length} exact, ${fuzzyMatches.length} fuzzy)`);
    }
    
    setIsLoading(false);
  }, [searchIndex, getCachedResults, setCachedResults, recordSearchTime]);

  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout;
    return (query: string) => {
      cancelRef.current = true; // Cancel previous search
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performOptimizedSearch(query), 150);
    };
  }, [performOptimizedSearch]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
    debouncedSearch(query);
  }, [debouncedSearch]);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    results,
    isLoading,
  };
};

// Fast word-based scoring algorithm
const calculateWordMatchScore = (queryWords: string[], targetWords: string[]): number => {
  if (queryWords.length === 0 || targetWords.length === 0) return 0;
  
  let matches = 0;
  let exactMatches = 0;
  
  for (const queryWord of queryWords) {
    for (const targetWord of targetWords) {
      if (targetWord.startsWith(queryWord)) {
        if (targetWord === queryWord) {
          exactMatches++;
        } else {
          matches++;
        }
      } else if (targetWord.includes(queryWord) && queryWord.length > 2) {
        matches += 0.5;
      }
    }
  }
  
  return (exactMatches * 2 + matches) / (queryWords.length * 2);
};