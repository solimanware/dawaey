import { useMemo, useState } from "react";
import { Drug } from "./useDrugsData";

// Enhanced Drug type with preprocessed lowercase fields for faster search
type PreprocessedDrug = Drug & {
  _tradename: string;
  _activeingredient: string;
  _group: string;
};

export const useSearch = (drugs: Drug[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  // Preprocess drugs data once to add lowercase fields for faster search
  const preprocessedDrugs = useMemo<PreprocessedDrug[]>(() => {
    return drugs.map((drug) => ({
      ...drug,
      _tradename: drug.tradename?.toLowerCase() ?? "",
      _activeingredient: drug.activeingredient?.toLowerCase() ?? "",
      _group: drug.group?.toLowerCase() ?? "",
    }));
  }, [drugs]);

  // Use useMemo for pure filtering - avoids unnecessary recomputation
  const filteredDrugs = useMemo(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 3) {
      return [];
    }

    const query = searchQuery.toLowerCase();
    return preprocessedDrugs.filter(
      (drug) =>
        drug._tradename.includes(query) ||
        drug._activeingredient.includes(query) ||
        drug._group.includes(query)
    );
  }, [preprocessedDrugs, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredDrugs,
    isLoading: false, // No internal debouncing, so no loading state needed
  };
};
