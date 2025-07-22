import { useEffect, useState } from "react";
import { useDebounce } from "./useDebounce";
import { Drug } from "./useDrugsData";

export const useSearch = (drugs: Drug[]) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredDrugs, setFilteredDrugs] = useState<Drug[]>(drugs);
  const [isLoading, setIsLoading] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    const performSearch = async () => {
      setIsLoading(true);

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 100));

      if (!debouncedSearchQuery.trim()) {
        setFilteredDrugs(drugs);
      } else {
        const filtered = drugs.filter(
          (drug: Drug) =>
            drug.tradename
              .toLowerCase()
              .includes(debouncedSearchQuery.toLowerCase()) ||
            (drug.activeingredient &&
              drug.activeingredient
                .toLowerCase()
                .includes(debouncedSearchQuery.toLowerCase()))
        );
        setFilteredDrugs(filtered);
      }

      setIsLoading(false);
    };

    performSearch();
  }, [drugs, debouncedSearchQuery]);

  return {
    searchQuery,
    setSearchQuery,
    filteredDrugs,
    isLoading,
  };
};
