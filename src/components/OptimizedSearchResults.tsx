import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import React from "react";
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
}

export const OptimizedSearchResults = ({
  results,
  searchQuery,
  isLoading = false,
}: OptimizedSearchResultsProps) => {
  const renderSearchResult = ({
    item,
  }: LegendListRenderItemProps<SearchResult>) => (
    <View>
      {/* Show match details for fuzzy search in dev mode */}
      {__DEV__ && item.matchType === "fuzzy" && (
        <View className="px-4 py-1 bg-purple-50">
          <Text className="text-xs text-purple-600">
            🔮 Fuzzy match in {item.matchedField} (score: {item.score.toFixed(3)})
            {item.matchedValue && ` - "${item.matchedValue}"`}
          </Text>
        </View>
      )}
      <MedicationCard
        item={item.drug}
        searchQuery={searchQuery}
        isHighlighted={item.matchType === "exact"}
      />
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
          No medications found for "{searchQuery}"
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Try a different search term or check spelling
        </Text>
      </View>
    );
  }

  const exactMatches = results.filter((r) => r.matchType === "exact");
  const fuzzyMatches = results.filter((r) => r.matchType === "fuzzy");

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
        removeClippedSubviews={true}
        maxToRenderPerBatch={8}
        windowSize={4}
        initialNumToRender={6}
        // Performance optimizations
        getItemType={(item) => item.matchType} // Help with recycling
        drawDistance={300} // Render items 300px before they come into view
      />
    </View>
  );
};
