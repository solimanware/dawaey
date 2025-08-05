import { Header, OptimizedSearchResults, SearchBar } from "@/components";
import {
  useAnalytics,
  useDrugsData,
  useGlowAnimation,
  useOptimizedSearch,
} from "@/hooks";
import "@/theme/global.css";
import { useFocusEffect, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  // Navigation params for CTA searches
  const params = useLocalSearchParams();

  // Input state for immediate UI updates
  const [inputValue, setInputValue] = useState("");
  const [isFuzzySearch, setIsFuzzySearch] = useState(false);
  const [searchType, setSearchType] = useState<string | null>(null);

  // Custom hooks
  const { drugs } = useDrugsData();
  const glowAnim = useGlowAnimation();
  const analytics = useAnalytics();

  // Single optimized search hook
  const { results, setSearchQuery, isLoading } = useOptimizedSearch(drugs);

  // Screen tracking
  useFocusEffect(
    useCallback(() => {
      analytics.logScreenView(analytics.SCREEN_NAMES.SEARCH);
    }, [analytics])
  );

  // Handle initial search from navigation params
  useEffect(() => {
    if (params.searchQuery && typeof params.searchQuery === "string") {
      const query = params.searchQuery;
      const type = (params.searchType as string) || null;

      setInputValue(query);
      setSearchQuery(query);
      setSearchType(type);

      // Track search from navigation
      analytics.logSearch(query, type || "navigation");
      if (type) {
        analytics.logSearchType(type as "alternatives" | "similar", query);
      }
    }
  }, [params.searchQuery, params.searchType, setSearchQuery, analytics]);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setSearchQuery(text);

    // Clear search type when user manually types
    if (searchType) {
      setSearchType(null);
    }

    // Track search queries (debounced through search hook)
    if (text.length >= 2) {
      analytics.logSearch(text, "manual_input");
      analytics.logSearchAnalytics(text);

      // Track wildcard patterns
      if (text.includes("*") && text.replace(/\*/g, "").length >= 2) {
        analytics.logWildcardSearch(text, results.length);
      }
    }
  };

  // Track search results display
  useEffect(() => {
    if (inputValue.length >= 2 && results.length > 0) {
      analytics.logEvent(analytics.ANALYTICS_EVENTS.SEARCH_RESULTS_VIEWED, {
        search_term: inputValue,
        results_count: results.length,
        search_type: searchType || "manual",
        has_fuzzy_match: isFuzzySearch,
      });
    }
  }, [results.length, inputValue, searchType, isFuzzySearch, analytics]);

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header Section */}
      <View className="px-6 pt-4 pb-6 backdrop-blur-lg">
        <Header />
        <SearchBar
          searchQuery={inputValue}
          onChangeText={handleInputChange}
          glowAnim={glowAnim}
        />
      </View>

      {/* Search Results */}
      {inputValue.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <Text className="text-center text-gray-500 text-sm">
            You can Search now...
          </Text>
          <Text className="text-center text-gray-400 text-xs mt-2">
            Start typing to find medications instantly
          </Text>
        </View>
      ) : (
        <View className="flex-1 relative">
          {/* Search Type Indicator */}
          {searchType && results.length > 0 && (
            <View className="mb-4 mx-6 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-3 rounded-xl border border-blue-200 shadow-sm z-10">
              <View className="flex-row items-center">
                <View className="w-6 h-6 rounded-full bg-blue-500 items-center justify-center mr-3">
                  <Text className="text-white text-xs font-bold">
                    {searchType === "alternatives" ? "🧪" : "📚"}
                  </Text>
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-blue-800 mb-0.5">
                    {searchType === "alternatives"
                      ? "Alternative Medications"
                      : "Similar Medications"}
                  </Text>
                  <Text className="text-xs text-blue-600">
                    {searchType === "alternatives"
                      ? "Medications with the same active ingredient"
                      : "Medications in the same drug group"}
                  </Text>
                </View>
              </View>
            </View>
          )}

          {/* Fuzzy Search Indicator */}
          {isFuzzySearch && results.length > 0 && !searchType && (
            <View className=" mb-4 mx-6 bg-purple-100 px-3 py-1 rounded-full border border-purple-200 shadow-sm z-10">
              <Text className="text-xs text-purple-700 font-medium">
                Do you mean... {results.length > 0 && " "}
                <Text className="text-xs text-purple-700 font-medium">
                  {results[0].drug.tradename.split(" ")[0]}?
                </Text>
              </Text>
            </View>
          )}
          <OptimizedSearchResults
            results={results}
            searchQuery={inputValue}
            isLoading={isLoading}
            onFuzzySearchDetected={(isFuzzy) => {
              setIsFuzzySearch(isFuzzy);
              if (isFuzzy && results.length > 0) {
                analytics.logFuzzySearch(inputValue, results[0].drug.tradename);
              }
            }}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
