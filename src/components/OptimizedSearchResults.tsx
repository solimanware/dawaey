import React from 'react';
import { View, Text } from 'react-native';
import { LegendList, LegendListRenderItemProps } from '@legendapp/list';
import { MedicationCard } from './MedicationCard';
import { Drug } from '../hooks/useDrugsData';

interface SearchResult {
  drug: Drug;
  score: number;
  matchType: "exact" | "fuzzy";
  matchedField: "tradename" | "activeingredient";
}

interface OptimizedSearchResultsProps {
  results: SearchResult[];
  searchQuery: string;
  isLoading?: boolean;
}

export const OptimizedSearchResults = ({ 
  results, 
  searchQuery, 
  isLoading = false 
}: OptimizedSearchResultsProps) => {
  
  const renderSearchResult = ({ item }: LegendListRenderItemProps<SearchResult>) => (
    <View>
      {/* Show match indicator for development/debugging */}
      {__DEV__ && (
        <View className="px-4 py-1">
          <Text className="text-xs text-gray-500">
            {item.matchType.toUpperCase()} match in {item.matchedField} (score: {item.score.toFixed(3)})
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

  const exactMatches = results.filter(r => r.matchType === "exact");
  const fuzzyMatches = results.filter(r => r.matchType === "fuzzy");

  return (
    <View className="flex-1">
      {/* Search Results Header */}
      <View className="px-4 py-2 bg-gray-100">
        <Text className="text-sm text-gray-600">
          Found {results.length} result{results.length !== 1 ? 's' : ''} for "{searchQuery}"
        </Text>
        {__DEV__ && exactMatches.length > 0 && fuzzyMatches.length > 0 && (
          <Text className="text-xs text-gray-500 mt-1">
            {exactMatches.length} exact, {fuzzyMatches.length} fuzzy matches
          </Text>
        )}
      </View>

      {/* Optimized List with Legend List */}
      <LegendList
        data={results}
        renderItem={renderSearchResult}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyExtractor={(item: SearchResult) => `${item.drug.id}-${item.matchType}-${item.score}`}
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