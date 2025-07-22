import DiffMatchPatch from "diff-match-patch";
import { useEffect, useState } from "react";
import { Drug } from "./useDrugsData";

export interface SearchResult {
  drug: Drug;
  score: number;
  matchedField: "tradename" | "activeingredient";
  matchedValue: string;
}

export interface SearchState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  fuzzyMatches: SearchResult[];
  topSuggestion: SearchResult | null;
  isLoading: boolean;
}

// Memoize DiffMatchPatch instance outside the hook for better performance
const dmp = new DiffMatchPatch();
dmp.Match_Threshold = 0.4;
dmp.Match_Distance = 100;

// Helper function to calculate fuzzy match score
const calculateScore = (
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

// Async fuzzy search function
const performFuzzySearch = async (
  drugs: Drug[],
  query: string
): Promise<{
  fuzzyMatches: SearchResult[];
  topSuggestion: SearchResult | null;
}> => {
  return new Promise((resolve) => {
    // Use setTimeout to make it async and allow UI to update
    setTimeout(() => {
      const resultMap = new Map<string, SearchResult>();

      for (const drug of drugs) {
        let bestScore = 0;
        let bestResult: SearchResult | null = null;

        // Check tradename
        const tradenameMatch = dmp.match_main(
          drug.tradename.toLowerCase(),
          query,
          0
        );
        if (tradenameMatch !== -1) {
          const score = calculateScore(
            drug.tradename,
            query,
            tradenameMatch,
            true
          );
          if (score > 0.25 && score > bestScore) {
            bestScore = score;
            bestResult = {
              drug,
              score,
              matchedField: "tradename",
              matchedValue: drug.tradename,
            };
          }
        }

        // Check active ingredient (now a single string)
        if (drug.activeingredient) {
          const ingredientMatch = dmp.match_main(
            drug.activeingredient.toLowerCase(),
            query,
            0
          );
          if (ingredientMatch !== -1) {
            const score = calculateScore(
              drug.activeingredient,
              query,
              ingredientMatch,
              false
            );
            if (score > 0.2 && score > bestScore) {
              bestScore = score;
              bestResult = {
                drug,
                score,
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
      }

      // Convert to array and sort by score
      const fuzzyMatches = Array.from(resultMap.values())
        .sort((a, b) => b.score - a.score)
        .slice(0, 10);

      const topSuggestion = fuzzyMatches.length > 0 ? fuzzyMatches[0] : null;

      resolve({ fuzzyMatches, topSuggestion });
    }, 0);
  });
};

export const useFuzzySearch = (drugs: Drug[]): SearchState => {
  const [searchQuery, setSearchQuery] = useState("");
  const [fuzzyMatches, setFuzzyMatches] = useState<SearchResult[]>([]);
  const [topSuggestion, setTopSuggestion] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const searchAsync = async () => {
      if (!searchQuery.trim()) {
        setFuzzyMatches([]);
        setTopSuggestion(null);
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const query = searchQuery.toLowerCase().trim();
        const results = await performFuzzySearch(drugs, query);

        setFuzzyMatches(results.fuzzyMatches);
        setTopSuggestion(results.topSuggestion);
      } catch (error) {
        console.error("Search error:", error);
        setFuzzyMatches([]);
        setTopSuggestion(null);
      } finally {
        setIsLoading(false);
      }
    };

    searchAsync();
  }, [searchQuery, drugs]);

  return {
    searchQuery,
    setSearchQuery,
    fuzzyMatches,
    topSuggestion,
    isLoading,
  };
};
