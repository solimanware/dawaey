import { useMemo, useState, useCallback } from "react";
import { Drug } from "./useDrugsData";
import { useOptimizedSearch } from "./useOptimizedSearch";
import { useWildcardSearch, isWildcardQuery } from "./useWildcardSearch";

// Union type for search results
export interface EnhancedSearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy" | "wildcard";
  matchedField: "tradename" | "activeingredient";
  matchedValue?: string;
  matchedPattern?: string;
}

export interface EnhancedSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: EnhancedSearchResult[];
  isLoading: boolean;
  searchMode: "optimized" | "wildcard";
  isWildcardQuery: boolean;
}

export const useEnhancedSearch = (drugs: Drug[]): EnhancedSearchState => {
  const [inputQuery, setInputQuery] = useState("");
  const [currentMode, setCurrentMode] = useState<"optimized" | "wildcard">("optimized");
  
  // Determine search mode based on query
  const isWildcard = useMemo(() => {
    return isWildcardQuery(inputQuery);
  }, [inputQuery]);

  // Initialize both search hooks
  const optimizedSearch = useOptimizedSearch(drugs);
  const wildcardSearch = useWildcardSearch(drugs);

  // Determine which search to use and get results
  const { results, isLoading } = useMemo(() => {
    if (isWildcard && inputQuery.trim()) {
      // Use wildcard search - map results to enhanced format
      const wildcardResults: EnhancedSearchResult[] = wildcardSearch.results.map(result => ({
        drug: result.drug,
        score: result.score,
        matchType: "wildcard" as const,
        matchedField: result.matchedField,
        matchedValue: result.matchedValue,
        matchedPattern: result.matchedPattern,
      }));
      
      return {
        results: wildcardResults,
        isLoading: wildcardSearch.isLoading,
      };
    } else if (!isWildcard && inputQuery.trim()) {
      // Use optimized search - map results to enhanced format  
      const optimizedResults: EnhancedSearchResult[] = optimizedSearch.results.map(result => ({
        drug: result.drug,
        score: result.score,
        matchType: result.matchType as "exact" | "fuzzy",
        matchedField: result.matchedField,
        matchedValue: result.matchedValue,
      }));
      
      return {
        results: optimizedResults,
        isLoading: optimizedSearch.isLoading,
      };
    } else {
      // Empty query - return empty results
      return {
        results: [],
        isLoading: false,
      };
    }
  }, [isWildcard, inputQuery, wildcardSearch.results, wildcardSearch.isLoading, optimizedSearch.results, optimizedSearch.isLoading]);

  // Handle search query changes
  const handleSearchChange = useCallback((query: string) => {
    setInputQuery(query);
    
    const willBeWildcard = isWildcardQuery(query);
    const newMode = willBeWildcard ? "wildcard" : "optimized";
    setCurrentMode(newMode);
    
    console.log(`🔍 Enhanced search mode: ${newMode} for query: "${query}"`);
    
    // Only update the appropriate search hook based on the new query
    if (willBeWildcard) {
      console.log(`🔮 Switching to wildcard search for: "${query}"`);
      wildcardSearch.setSearchQuery(query);
      // Immediately clear optimized search results
      optimizedSearch.setSearchQuery("");
    } else {
      console.log(`⚡ Switching to optimized search for: "${query}"`);
      optimizedSearch.setSearchQuery(query);
      // Immediately clear wildcard search results
      wildcardSearch.setSearchQuery("");
    }
  }, [optimizedSearch, wildcardSearch]);

  return {
    searchQuery: inputQuery,
    setSearchQuery: handleSearchChange,
    results,
    isLoading,
    searchMode: currentMode,
    isWildcardQuery: isWildcard,
  };
};