import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { Drug } from "../hooks/useDrugsData";
import { MedicationCard } from "./MedicationCard";

interface SearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy";
  matchedField: "tradename" | "activeingredient";
  matchedValue?: string;
}

interface OptimizedSearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading?: boolean;
  onFuzzySearchDetected?: (isFuzzySearch: boolean) => void;
}

export const OptimizedSearchResults = ({
  results,
  searchQuery,
  isLoading = false,
  onFuzzySearchDetected,
}: OptimizedSearchResultsProps) => {
  const fuzzyMatches = results.filter((r) => r.matchType === "fuzzy");
  const isFuzzySearch = fuzzyMatches.length > 0;

  // Emit fuzzy search detection to parent - must be called at component level
  useEffect(() => {
    onFuzzySearchDetected?.(isFuzzySearch);
  }, [isFuzzySearch, onFuzzySearchDetected]);

  const renderSearchResult = ({
    item,
  }: LegendListRenderItemProps<SearchResult>) => (
    <View>
      <MedicationCard item={item.drug} />
    </View>
  );

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500">Searching...</Text>
      </View>
    );
  }

  if (results.length === 0) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500 text-center">
          No medications found for &quot;{searchQuery}&quot;
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Try a different search term or check spelling
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Optimized List with Legend List */}
      <LegendList
        data={results}
        renderItem={renderSearchResult}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyExtractor={(item: SearchResult) =>
          `${item.drug.id}-${item.matchType}-${item.score}`
        }
        recycleItems={true}
        maintainVisibleContentPosition
      />
    </View>
  );
};
