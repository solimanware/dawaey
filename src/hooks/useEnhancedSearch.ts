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
  
  // Determine search mode based on query
  const isWildcard = useMemo(() => {
    return isWildcardQuery(inputQuery);
  }, [inputQuery]);

  // Initialize both search hooks
  const optimizedSearch = useOptimizedSearch(drugs);
  const wildcardSearch = useWildcardSearch(drugs);

  // Determine which search to use and get results
  const { results, isLoading, searchMode } = useMemo(() => {
    if (isWildcard) {
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
        searchMode: "wildcard" as const,
      };
    } else {
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
        searchMode: "optimized" as const,
      };
    }
  }, [isWildcard, wildcardSearch.results, wildcardSearch.isLoading, optimizedSearch.results, optimizedSearch.isLoading]);

  // Handle search query changes
  const handleSearchChange = useCallback((query: string) => {
    setInputQuery(query);
    
    // Update the appropriate search hook
    if (isWildcardQuery(query)) {
      wildcardSearch.setSearchQuery(query);
      // Clear optimized search when switching to wildcard
      if (optimizedSearch.searchQuery !== "") {
        optimizedSearch.setSearchQuery("");
      }
    } else {
      optimizedSearch.setSearchQuery(query);
      // Clear wildcard search when switching to optimized
      if (wildcardSearch.searchQuery !== "") {
        wildcardSearch.setSearchQuery("");
      }
    }
  }, [optimizedSearch, wildcardSearch]);

  return {
    searchQuery: inputQuery,
    setSearchQuery: handleSearchChange,
    results,
    isLoading,
    searchMode,
    isWildcardQuery: isWildcard,
  };
};