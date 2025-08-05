import { useMemo, useState } from "react";
import { useDebounce } from "./useDebounce";
import { Drug } from "./useDrugsData";

// Enhanced Drug type with preprocessed lowercase fields for faster search
type PreprocessedDrug = Drug & {
  _tradename: string;
  _activeingredient: string;
};

export const useSearch = (drugs: Drug[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  // Preprocess drugs data once to add lowercase fields for faster search
  const preprocessedDrugs = useMemo<PreprocessedDrug[]>(() => {
    return drugs.map(drug => ({
      ...drug,
      _tradename: drug.tradename?.toLowerCase() ?? "",
      _activeingredient: drug.activeingredient?.toLowerCase() ?? "",
    }));
  }, [drugs]);

  // Use useMemo for pure filtering - avoids unnecessary recomputation
  const filteredDrugs = useMemo(() => {
    if (!debouncedSearchQuery.trim()) {
      return preprocessedDrugs;
    }

    const query = debouncedSearchQuery.toLowerCase();
    return preprocessedDrugs.filter(
      (drug) =>
        drug._tradename.includes(query) ||
        drug._activeingredient.includes(query)
    );
  }, [preprocessedDrugs, debouncedSearchQuery]);

  // Calculate loading state based on whether search is being debounced
  const isLoading = useMemo(() => {
    return searchQuery !== debouncedSearchQuery && searchQuery.length > 0;
  }, [searchQuery, debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredDrugs,
    isLoading,
  };
};
