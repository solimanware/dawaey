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
  const hasWildcard = query.includes('*');
  const isLongEnough = query.length >= 3;
  const hasEnoughNonWildcards = query.replace(/\*/g, '').length >= 2; // At least 2 actual letters
  
  const isWildcard = hasWildcard && isLongEnough && hasEnoughNonWildcards;
  
  if (hasWildcard) {
    console.log(`🔍 Checking wildcard query "${query}": hasWildcard=${hasWildcard}, length=${query.length}, nonWildcards=${query.replace(/\*/g, '').length}, isWildcard=${isWildcard}`);
  }
  
  return isWildcard;
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
    console.log(`🔮 Pattern "${pattern}" is not a valid wildcard query`);
    return [];
  }

  const regex = createWildcardRegex(pattern.toLowerCase());
  console.log(`🔮 Created regex: ${regex} for pattern: "${pattern}"`);
  
  const results: WildcardSearchResult[] = [];
  const seen = new Set<number>(); // Track drugs we've already added
  let matchCount = 0;
  let checkedCount = 0;

  for (const drug of drugs) {
    checkedCount++;
    if (checkedCount <= 10) { // Only log first 10 for debugging
      console.log(`🔮 Checking drug ${checkedCount}: "${drug.tradename}"`);
    }
    let bestResult: WildcardSearchResult | null = null;
    let bestScore = 0;

    // Check tradename
    if (drug.tradename) {
      const match = drug.tradename.toLowerCase().match(regex);
      if (match) {
        matchCount++;
        if (matchCount <= 5) { // Log first 5 matches for debugging
          console.log(`🔮 MATCH found in tradename: "${drug.tradename}" -> "${match[0]}" at index ${match.index}`);
        }
        
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

  console.log(`🔮 Wildcard search summary: ${results.length} unique matches found from ${matchCount} total matches out of ${checkedCount} drugs checked`);
  
  // Sort by score (highest first) and limit results
  const sortedResults = results
    .sort((a, b) => b.score - a.score)
    .slice(0, 15);
    
  if (sortedResults.length > 0) {
    console.log(`🔮 Top result: "${sortedResults[0].drug.tradename}" (score: ${sortedResults[0].score.toFixed(3)})`);
  }
  
  return sortedResults;
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

    const trimmedQuery = searchQuery.trim();
    console.log(`🔮 Wildcard search for: "${trimmedQuery}"`);
    
    setIsLoading(true);
    const searchResults = performWildcardSearch(drugs, trimmedQuery);
    setIsLoading(false);
    
    console.log(`🔮 Wildcard search results: ${searchResults.length} matches`);
    if (searchResults.length > 0) {
      console.log(`🔮 Top wildcard match: ${searchResults[0].drug.tradename}`);
    }
    
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