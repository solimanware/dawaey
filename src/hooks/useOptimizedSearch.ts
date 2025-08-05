import DiffMatchPatch from "diff-match-patch";
import { useCallback, useMemo, useRef, useState } from "react";
import { SearchResult } from "../types/search";
import { useAnalytics } from "./useAnalytics";
import { Drug } from "./useDrugsData";
import { usePerformanceMonitor } from "./usePerformanceMonitor";
import { useSearchCache } from "./useSearchCache";

interface SearchIndex {
  id: number;
  tradename: string;
  activeingredient: string;
  group: string;
  tradenameWords: string[];
  ingredientWords: string[];
  groupWords: string[];
  drug: Drug;
}

// Memoize DiffMatchPatch instance for fuzzy search performance
const dmp = new DiffMatchPatch();
dmp.Match_Threshold = 0.3;
dmp.Match_Distance = 14;

// Helper function to get first two words from a string
const getFirstTwoWords = (text: string): string => {
  if (!text) return "";
  const words = text.trim().split(/\s+/);
  return words.slice(0, 2).join(" ");
};

// Wildcard search utilities
const isWildcardPattern = (query: string): boolean => {
  return query.includes("*") && query.replace(/\*/g, "").length >= 2;
};

const convertWildcardToRegex = (pattern: string): RegExp => {
  // Escape special regex characters except *
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  // Replace * with .* (any characters, zero or more)
  const regexPattern = escaped.replace(/\*/g, ".*");
  // Create case-insensitive regex
  return new RegExp(regexPattern, "i");
};

const calculateWildcardScore = (
  text: string,
  query: string,
  isTradenamе: boolean = true
): number => {
  // Remove * from query for length comparison
  const queryWithoutWildcards = query.replace(/\*/g, "");
  const queryLength = queryWithoutWildcards.length;
  const textLength = text.length;

  // Base score is higher for tradenames
  const baseScore = isTradenamе ? 0.7 : 0.5;

  // Length ratio bonus (closer lengths get higher scores)
  const lengthRatio =
    Math.min(queryLength, textLength) / Math.max(queryLength, textLength);
  const lengthBonus = lengthRatio * 0.2;

  // Starts with bonus (if text starts with first part of pattern)
  const firstPart = query.split("*")[0];
  const startsWithBonus =
    firstPart.length > 0 &&
    text.toLowerCase().startsWith(firstPart.toLowerCase())
      ? 0.1
      : 0;

  // Character coverage bonus (how many query chars are in the text)
  const queryChars = new Set(queryWithoutWildcards.toLowerCase().split(""));
  const textChars = new Set(text.toLowerCase().split(""));
  const intersection = [...queryChars].filter((char) => textChars.has(char));
  const coverage = intersection.length / queryChars.size;
  const coverageBonus = coverage * 0.1;

  return Math.min(1, baseScore + lengthBonus + startsWithBonus + coverageBonus);
};

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
  const { get: getCachedResults, set: setCachedResults } =
    useSearchCache<SearchResult>();
  const { recordSearchTime } = usePerformanceMonitor();
  const analytics = useAnalytics();

  // Create search index once - this is the key optimization
  const searchIndex = useMemo<SearchIndex[]>(() => {
    //console.log("🏗️ Building optimized search index...");
    const startTime = performance.now();

    const index = drugs.map((drug) => ({
      id: drug.id,
      tradename: drug.tradename?.toLowerCase() ?? "",
      activeingredient: drug.activeingredient?.toLowerCase() ?? "",
      group: drug.group?.toLowerCase() ?? "",
      tradenameWords: drug.tradename?.toLowerCase().split(/\s+/) ?? [],
      ingredientWords: drug.activeingredient?.toLowerCase().split(/\s+/) ?? [],
      groupWords: drug.group?.toLowerCase().split(/\s+/) ?? [],
      drug,
    }));

    const endTime = performance.now();
    //console.log(
    //   `📊 Search index built in ${(endTime - startTime).toFixed(2)}ms for ${drugs.length} drugs`
    // );
    return index;
  }, [drugs]);

  const performOptimizedSearch = useCallback(
    async (query: string) => {
      try {
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
          recordSearchTime(cacheTime, true, query, cachedResults.length);
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
              matchedField: "tradename",
            });
          }
          // Exact ingredient match
          else if (item.activeingredient.includes(searchTerm)) {
            exactMatches.push({
              drug: item.drug,
              score: 0.6,
              matchType: "exact",
              matchedField: "activeingredient",
            });
          }
          // Exact group match
          else if (item.group.includes(searchTerm)) {
            exactMatches.push({
              drug: item.drug,
              score: 0.5,
              matchType: "exact",
              matchedField: "group",
            });
          }

          // Early termination if we have enough exact matches
          if (exactMatches.length >= 20) {
            //console.log(
            //   `⚡ Early termination: Found ${exactMatches.length} exact matches after ${i + 1} iterations`
            // );
            break;
          }
        }

        // Phase 1.5: Wildcard search (if pattern contains *)
        const wildcardMatches: SearchResult[] = [];
        if (isWildcardPattern(searchTerm)) {
          //console.log(`🔥 Detected wildcard pattern: ${searchTerm}`);
          const wildcardStartTime = performance.now();
          const wildcardRegex = convertWildcardToRegex(searchTerm);

          for (let i = 0; i < searchIndex.length && !cancelRef.current; i++) {
            const item = searchIndex[i];

            // Test wildcard pattern against first two words of tradename
            const tradenameFirstTwoWords = getFirstTwoWords(item.tradename);
            if (wildcardRegex.test(tradenameFirstTwoWords)) {
              const score = calculateWildcardScore(
                tradenameFirstTwoWords,
                searchTerm,
                true
              );
              wildcardMatches.push({
                drug: item.drug,
                score,
                matchType: "fuzzy", // Treat as fuzzy since it's pattern matching
                matchedField: "tradename",
                matchedValue: item.drug.tradename,
              });
            }
            // Test wildcard pattern against first two words of active ingredient
            else if (item.activeingredient) {
              const ingredientFirstTwoWords = getFirstTwoWords(
                item.activeingredient
              );
              if (wildcardRegex.test(ingredientFirstTwoWords)) {
                const score = calculateWildcardScore(
                  ingredientFirstTwoWords,
                  searchTerm,
                  false
                );
                wildcardMatches.push({
                  drug: item.drug,
                  score,
                  matchType: "fuzzy",
                  matchedField: "activeingredient",
                  matchedValue: item.drug.activeingredient,
                });
              }
            }
            // Test wildcard pattern against group
            else if (item.group) {
              const groupFirstTwoWords = getFirstTwoWords(item.group);
              if (wildcardRegex.test(groupFirstTwoWords)) {
                const score = calculateWildcardScore(
                  groupFirstTwoWords,
                  searchTerm,
                  false
                );
                wildcardMatches.push({
                  drug: item.drug,
                  score,
                  matchType: "fuzzy",
                  matchedField: "group",
                  matchedValue: item.drug.group,
                });
              }
            }
          }

          const wildcardEndTime = performance.now();
          //console.log(
          //   `🔥 Wildcard search completed in ${(wildcardEndTime - wildcardStartTime).toFixed(2)}ms with ${wildcardMatches.length} matches`
          // );
        }

        // If we have good exact matches or wildcard matches, return them
        const primaryMatches = [...exactMatches, ...wildcardMatches];
        if (primaryMatches.length >= 5) {
          const sortedResults = primaryMatches
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);

          setResults(sortedResults);
          setCachedResults(searchTerm, sortedResults);
          setIsLoading(false);

          const searchEndTime = performance.now();
          const searchTime = searchEndTime - searchStartTime;
          recordSearchTime(searchTime);
          const searchType =
            wildcardMatches.length > 0 ? "wildcard + exact" : "exact";
          //console.log(
          //   `🔍 ${searchType} search completed in ${searchTime.toFixed(2)}ms with ${sortedResults.length} results`
          // );
          return;
        }

        // Phase 2: Sophisticated DiffMatchPatch fuzzy search as fallback
        if (primaryMatches.length < 5 && !cancelRef.current) {
          //console.log("🔮 Performing sophisticated fuzzy search as fallback...");
          const fuzzyStartTime = performance.now();
          const resultMap = new Map<string, SearchResult>();

          for (let i = 0; i < searchIndex.length && !cancelRef.current; i++) {
            const drug = searchIndex[i].drug;
            let bestScore = 0;
            let bestResult: SearchResult | null = null;

            // Check first two words of tradename with DiffMatchPatch
            const tradenameFirstTwoWords = getFirstTwoWords(
              drug.tradename
            ).toLowerCase();
            const tradenameMatch = dmp.match_main(
              tradenameFirstTwoWords,
              searchTerm,
              0
            );
            if (tradenameMatch !== -1) {
              const score = calculateFuzzyScore(
                tradenameFirstTwoWords,
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

            // Check first two words of active ingredient with DiffMatchPatch
            if (drug.activeingredient) {
              const ingredientFirstTwoWords = getFirstTwoWords(
                drug.activeingredient
              ).toLowerCase();
              const ingredientMatch = dmp.match_main(
                ingredientFirstTwoWords,
                searchTerm,
                0
              );
              if (ingredientMatch !== -1) {
                const score = calculateFuzzyScore(
                  ingredientFirstTwoWords,
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

            // Check group with DiffMatchPatch
            if (drug.group) {
              const groupText = drug.group.toLowerCase();
              const groupMatch = dmp.match_main(groupText, searchTerm, 0);
              if (groupMatch !== -1) {
                const score = calculateFuzzyScore(
                  groupText,
                  searchTerm,
                  groupMatch,
                  false
                );
                if (score > 0.2 && score > bestScore) {
                  bestScore = score;
                  bestResult = {
                    drug,
                    score,
                    matchType: "fuzzy",
                    matchedField: "group",
                    matchedValue: drug.group,
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
              //console.log(
              //   `🔮 Fuzzy search early termination: Found ${resultMap.size} matches after ${i + 1} iterations`
              // );
              break;
            }
          }

          // Convert map to array and sort by score
          const fuzzyResults = Array.from(resultMap.values())
            .sort((a, b) => b.score - a.score)
            .slice(0, 10);

          fuzzyMatches.push(...fuzzyResults);

          const fuzzyEndTime = performance.now();
          //console.log(
          //   `🔮 Sophisticated fuzzy search completed in ${(fuzzyEndTime - fuzzyStartTime).toFixed(2)}ms with ${fuzzyResults.length} matches`
          // );
        }

        if (!cancelRef.current) {
          const allResults = [
            ...exactMatches,
            ...wildcardMatches,
            ...fuzzyMatches,
          ]
            .sort((a, b) => b.score - a.score)
            .slice(0, 15);

          setResults(allResults);
          setCachedResults(searchTerm, allResults);

          const searchEndTime = performance.now();
          const searchTime = searchEndTime - searchStartTime;
          recordSearchTime(searchTime, false, query, allResults.length);
          //console.log(
          //   `🎯 Complete search finished in ${searchTime.toFixed(2)}ms with ${allResults.length} results (${exactMatches.length} exact, ${wildcardMatches.length} wildcard, ${fuzzyMatches.length} fuzzy)`
          // );
        }
      } catch (error) {
        console.error("Search error:", error);
        analytics.logError(
          error instanceof Error ? error : new Error("Unknown search error"),
          "optimized_search",
          {
            query,
            search_term: query.toLowerCase().trim(),
            drugs_count: drugs.length,
            search_index_length: searchIndex.length,
          }
        );
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    },
    [
      searchIndex,
      getCachedResults,
      setCachedResults,
      recordSearchTime,
      analytics,
      drugs.length,
    ]
  );

  const debouncedSearch = useMemo(() => {
    let timeoutId: ReturnType<typeof setTimeout>;
    return (query: string) => {
      cancelRef.current = true; // Cancel previous search
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => performOptimizedSearch(query), 150);
    };
  }, [performOptimizedSearch]);

  const handleSearchChange = useCallback(
    (query: string) => {
      setSearchQuery(query);
      debouncedSearch(query);
    },
    [debouncedSearch]
  );

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    results,
    isLoading,
  };
};
