import { useMemo, useState, useCallback, useRef } from "react";
import DiffMatchPatch from "diff-match-patch";
import { Drug } from "./useDrugsData";
import { useSearchCache } from "./useSearchCache";
import { usePerformanceMonitor } from "./usePerformanceMonitor";

interface SearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy";
  matchedField: "tradename" | "activeingredient";
  matchedValue?: string;
}

interface SearchIndex {
  id: number;
  tradename: string;
  activeingredient: string;
  tradenameWords: string[];
  ingredientWords: string[];
  drug: Drug;
}

// Memoize DiffMatchPatch instance for fuzzy search performance
const dmp = new DiffMatchPatch();
dmp.Match_Threshold = 0.4;
dmp.Match_Distance = 100;

// Sophisticated fuzzy match scoring (from useFuzzySearch)
const calculateFuzzyScore = (
  text: string,
  query: string,
  matchPosition: number,
  isTradenamе: boolean = true
): number => {
  const distance = Math.abs(matchPosition);
  const maxLength = Math.max(text.length, query.length);
  const minLength = Math.min(text.length, query.length);

  // Position score (earlier matches are better)
  const positionScore = Math.max(0, 1 - distance / text.length);

  // Length similarity
  const lengthRatio = minLength / maxLength;

  // Starts with bonus
  const startsWithBonus = text.toLowerCase().startsWith(query.toLowerCase())
    ? 0.3
    : 0;

  // Character overlap
  const queryChars = new Set(query.toLowerCase().split(""));
  const textChars = new Set(text.toLowerCase().split(""));
  const intersection = [...queryChars].filter((char) => textChars.has(char));
  const overlap = intersection.length / queryChars.size;

  // Base score is higher for tradenames
  const baseScore = isTradenamе ? 0.1 : 0.05;

  // Weighted combination
  const score = Math.min(
    1,
    positionScore * 0.4 +
      lengthRatio * 0.2 +
      overlap * 0.3 +
      startsWithBonus +
      baseScore
  );

  return score;
};

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

    // Phase 2: Sophisticated DiffMatchPatch fuzzy search as fallback
    if (exactMatches.length < 5 && !cancelRef.current) {
      console.log("🔮 Performing sophisticated fuzzy search as fallback...");
      const fuzzyStartTime = performance.now();
      const resultMap = new Map<string, SearchResult>();
      
      for (let i = 0; i < searchIndex.length && !cancelRef.current; i++) {
        const drug = searchIndex[i].drug;
        let bestScore = 0;
        let bestResult: SearchResult | null = null;

        // Check tradename with DiffMatchPatch
        const tradenameMatch = dmp.match_main(
          drug.tradename.toLowerCase(),
          searchTerm,
          0
        );
        if (tradenameMatch !== -1) {
          const score = calculateFuzzyScore(
            drug.tradename,
            searchTerm,
            tradenameMatch,
            true
          );
          if (score > 0.25 && score > bestScore) {
            bestScore = score;
            bestResult = {
              drug,
              score,
              matchType: "fuzzy",
              matchedField: "tradename",
              matchedValue: drug.tradename,
            };
          }
        }

        // Check active ingredient with DiffMatchPatch
        if (drug.activeingredient) {
          const ingredientMatch = dmp.match_main(
            drug.activeingredient.toLowerCase(),
            searchTerm,
            0
          );
          if (ingredientMatch !== -1) {
            const score = calculateFuzzyScore(
              drug.activeingredient,
              searchTerm,
              ingredientMatch,
              false
            );
            if (score > 0.2 && score > bestScore) {
              bestScore = score;
              bestResult = {
                drug,
                score,
                matchType: "fuzzy",
                matchedField: "activeingredient",
                matchedValue: drug.activeingredient,
              };
            }
          }
        }

        // Only add the best result for each drug
        if (bestResult) {
          resultMap.set(drug.id.toString(), bestResult);
        }

        // Early termination for fuzzy search - check every 100 iterations
        if (i % 100 === 0 && resultMap.size >= 10) {
          console.log(`🔮 Fuzzy search early termination: Found ${resultMap.size} matches after ${i + 1} iterations`);
          break;
        }
      }

      // Convert map to array and sort by score
      const fuzzyResults = Array.from(resultMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);
      
      fuzzyMatches.push(...fuzzyResults);
      
      const fuzzyEndTime = performance.now();
      console.log(`🔮 Sophisticated fuzzy search completed in ${(fuzzyEndTime - fuzzyStartTime).toFixed(2)}ms with ${fuzzyResults.length} matches`);
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

// Legacy: Fast word-based scoring (kept for potential future use)
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