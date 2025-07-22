import { useMemo, useState } from "react";
import { Drug } from "./useDrugsData";

export const useSearch = (drugs: Drug[]) => {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredDrugs = useMemo(() => {
    if (!searchQuery.trim()) {
      return drugs;
    }

    return drugs.filter(
      (drug: Drug) =>
        drug.tradename.toLowerCase().includes(searchQuery.toLowerCase()) ||
        drug.activeIngredients.some((ingredient) =>
          ingredient.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [drugs, searchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredDrugs,
  };
};
