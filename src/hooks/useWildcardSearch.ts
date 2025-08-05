import { useMemo, useState, useCallback } from "react";
import { Drug } from "./useDrugsData";

interface WildcardSearchResult {
  drug: Drug;
  score: number;
  matchType: "wildcard";
  matchedField: "tradename" | "activeingredient";
  matchedValue: string;
  matchedPattern: string;
}

interface WildcardSearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  results: WildcardSearchResult[];
  isLoading: boolean;
  isWildcardQuery: boolean;
}

// Convert wildcard pattern to regex
const createWildcardRegex = (pattern: string): RegExp => {
  // Escape special regex characters except *
  const escapedPattern = pattern
    .replace(/[.+?^${}()|[\]\\]/g, '\\$&')
    .replace(/\*/g, '.*?'); // Replace * with .*? for non-greedy matching
  
  return new RegExp(escapedPattern, 'i'); // Case insensitive
};

// Check if query contains wildcards
const isWildcardQuery = (query: string): boolean => {
  return query.includes('*') && query.length >= 3;
};

// Calculate score based on how well the pattern matches
const calculateWildcardScore = (
  text: string,
  pattern: string,
  match: RegExpMatchArray,
  isTradenamе: boolean = true
): number => {
  const matchedText = match[0];
  const matchIndex = match.index || 0;
  
  // Base score for tradename vs activeingredient
  const baseScore = isTradenamе ? 0.8 : 0.6;
  
  // Position bonus (earlier matches score higher)
  const positionBonus = Math.max(0, 1 - (matchIndex / text.length)) * 0.2;
  
  // Length efficiency (shorter matches are better for wildcard)
  const lengthRatio = pattern.replace(/\*/g, '').length / matchedText.length;
  const lengthBonus = Math.min(lengthRatio, 1) * 0.3;
  
  // Pattern complexity bonus (more specific patterns score higher)
  const wildcardCount = (pattern.match(/\*/g) || []).length;
  const letterCount = pattern.replace(/\*/g, '').length;
  const complexityBonus = (letterCount / (wildcardCount + letterCount)) * 0.2;
  
  // Starts with bonus
  const startsWithBonus = matchIndex === 0 ? 0.1 : 0;
  
  return Math.min(1, baseScore + positionBonus + lengthBonus + complexityBonus + startsWithBonus);
};

// Perform wildcard search
const performWildcardSearch = (
  drugs: Drug[],
  pattern: string
): WildcardSearchResult[] => {
  if (!isWildcardQuery(pattern)) {
    return [];
  }

  const regex = createWildcardRegex(pattern.toLowerCase());
  const results: WildcardSearchResult[] = [];
  const seen = new Set<number>(); // Track drugs we've already added

  for (const drug of drugs) {
    let bestResult: WildcardSearchResult | null = null;
    let bestScore = 0;

    // Check tradename
    if (drug.tradename) {
      const match = drug.tradename.toLowerCase().match(regex);
      if (match) {
        const score = calculateWildcardScore(
          drug.tradename,
          pattern,
          match,
          true
        );
        
        if (score > bestScore) {
          bestScore = score;
          bestResult = {
            drug,
            score,
            matchType: "wildcard",
            matchedField: "tradename",
            matchedValue: drug.tradename,
            matchedPattern: pattern,
          };
        }
      }
    }

    // Check active ingredient
    if (drug.activeingredient && drug.activeingredient.trim()) {
      const match = drug.activeingredient.toLowerCase().match(regex);
      if (match) {
        const score = calculateWildcardScore(
          drug.activeingredient,
          pattern,
          match,
          false
        );
        
        if (score > bestScore) {
          bestScore = score;
          bestResult = {
            drug,
            score,
            matchType: "wildcard",
            matchedField: "activeingredient",
            matchedValue: drug.activeingredient,
            matchedPattern: pattern,
          };
        }
      }
    }

    // Add the best result for this drug
    if (bestResult && !seen.has(drug.id)) {
      results.push(bestResult);
      seen.add(drug.id);
    }
  }

  // Sort by score (highest first) and limit results
  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
};

export const useWildcardSearch = (drugs: Drug[]): WildcardSearchState => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const isWildcard = useMemo(() => {
    return isWildcardQuery(searchQuery);
  }, [searchQuery]);

  const results = useMemo(() => {
    if (!isWildcard || !searchQuery.trim()) {
      return [];
    }

    setIsLoading(true);
    const searchResults = performWildcardSearch(drugs, searchQuery.trim());
    setIsLoading(false);
    
    return searchResults;
  }, [drugs, searchQuery, isWildcard]);

  const handleSearchChange = useCallback((query: string) => {
    setSearchQuery(query);
  }, []);

  return {
    searchQuery,
    setSearchQuery: handleSearchChange,
    results,
    isLoading,
    isWildcardQuery: isWildcard,
  };
};

// Export utility functions for external use
export { isWildcardQuery, createWildcardRegex };