import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import React, { useEffect } from "react";
import { Text, View } from "react-native";
import { EnhancedSearchResult } from "../hooks/useEnhancedSearch";
import { MedicationCard } from "./MedicationCard";

interface EnhancedSearchResultsProps {
  results: EnhancedSearchResult[];
  searchQuery: string;
  isLoading?: boolean;
  searchMode: "optimized" | "wildcard";
  isWildcardQuery: boolean;
  onSearchModeDetected?: (mode: "optimized" | "wildcard") => void;
}

export const EnhancedSearchResults = ({
  results,
  searchQuery,
  isLoading = false,
  searchMode,
  isWildcardQuery,
  onSearchModeDetected,
}: EnhancedSearchResultsProps) => {
  const fuzzyMatches = results.filter((r) => r.matchType === "fuzzy");
  const wildcardMatches = results.filter((r) => r.matchType === "wildcard");
  const exactMatches = results.filter((r) => r.matchType === "exact");

  // Emit search mode detection to parent
  useEffect(() => {
    onSearchModeDetected?.(searchMode);
  }, [searchMode, onSearchModeDetected]);

  const renderSearchResult = ({
    item,
  }: LegendListRenderItemProps<EnhancedSearchResult>) => (
    <View>
      <MedicationCard item={item.drug} />
    </View>
  );

  const getSearchModeIndicator = () => {
    if (isWildcardQuery && wildcardMatches.length > 0) {
      return (
        <View className="mb-4 mx-6 bg-blue-100 px-3 py-1 rounded-full border border-blue-200 shadow-sm">
          <Text className="text-xs text-blue-700 font-medium">
            Wildcard Search: "{searchQuery}" → {wildcardMatches.length} result{wildcardMatches.length !== 1 ? 's' : ''}
          </Text>
          <Text className="text-xs text-blue-600 mt-1">
            Use * as wildcard (e.g., A*G*M*N for Augmentin)
          </Text>
        </View>
      );
    }
    
    if (fuzzyMatches.length > 0) {
      return (
        <View className="mb-4 mx-6 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 shadow-sm">
          <Text className="text-xs text-purple-700 font-medium">
            Smart Search: Did you mean "{results[0]?.drug.tradename}"?
          </Text>
        </View>
      );
    }
    
    return null;
  };

  const getEmptyStateMessage = () => {
    if (isWildcardQuery) {
      return (
        <View className="flex-1 items-center justify-center py-8">
          <Text className="text-gray-500 text-center">
            No medications found for wildcard pattern &quot;{searchQuery}&quot;
          </Text>
          <Text className="text-gray-400 text-sm text-center mt-2">
            Try adjusting your wildcard pattern
          </Text>
          <Text className="text-gray-400 text-xs text-center mt-2">
            Example: A*G*M for medications containing A, then G, then M
          </Text>
        </View>
      );
    }
    
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500 text-center">
          No medications found for &quot;{searchQuery}&quot;
        </Text>
        <Text className="text-gray-400 text-sm text-center mt-2">
          Try a different search term or use wildcards (*)
        </Text>
        <Text className="text-gray-400 text-xs text-center mt-1">
          Example: A*G*M*N to find Augmentin
        </Text>
      </View>
    );
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center py-8">
        <Text className="text-gray-500">
          {isWildcardQuery ? 'Processing wildcard search...' : 'Searching...'}
        </Text>
      </View>
    );
  }

  if (results.length === 0) {
    return getEmptyStateMessage();
  }

  return (
    <View className="flex-1">
      {/* Search Mode Indicator */}
      {getSearchModeIndicator()}
      
      {/* Results List */}
      <LegendList
        data={results}
        renderItem={renderSearchResult}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
        keyExtractor={(item: EnhancedSearchResult) =>
          `${item.drug.id}-${item.matchType}-${item.score}-${item.matchedPattern || ''}`
        }
        recycleItems={true}
        maintainVisibleContentPosition
      />
      
      {/* Results Summary */}
      {results.length > 0 && (
        <View className="absolute bottom-0 left-0 right-0 bg-white/90 backdrop-blur-sm border-t border-gray-200 px-6 py-2">
          <Text className="text-xs text-gray-600 text-center">
            {exactMatches.length > 0 && `${exactMatches.length} exact`}
            {exactMatches.length > 0 && (fuzzyMatches.length > 0 || wildcardMatches.length > 0) && ', '}
            {fuzzyMatches.length > 0 && `${fuzzyMatches.length} fuzzy`}
            {fuzzyMatches.length > 0 && wildcardMatches.length > 0 && ', '}
            {wildcardMatches.length > 0 && `${wildcardMatches.length} wildcard`}
            {' match'}
            {(exactMatches.length + fuzzyMatches.length + wildcardMatches.length) !== 1 ? 'es' : ''}
          </Text>
        </View>
      )}
    </View>
  );
};