import { Drug } from "../hooks/useDrugsData";

export interface SearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy";
  matchedField: "tradename" | "activeingredient" | "group";
  matchedValue?: string;
}

export interface FuzzySearchResult {
  drug: Drug;
  score: number;
  matchedField: "tradename" | "activeingredient";
  matchedValue: string;
}