import {
  FuzzySearchResults,
  Header,
  MedicationCard,
  SearchBar,
} from "@/components";
import {
  Drug,
  useDebounce,
  useDrugsData,
  useFuzzySearch,
  useGlowAnimation,
  useSearch,
} from "@/hooks";
import "@/theme/global.css";
import { LegendList, LegendListRenderItemProps } from "@legendapp/list";
import { useEffect, useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  // Input state for immediate UI updates
  const [inputValue, setInputValue] = useState("");

  // Debounced search query for actual search functionality
  const debouncedSearchQuery = useDebounce(inputValue, 300);

  // Custom hooks
  const { drugs } = useDrugsData();

  // Normal search first
  const {
    filteredDrugs,
    setSearchQuery: setNormalSearchQuery,
    isLoading: isNormalSearchLoading,
  } = useSearch(drugs);

  // Fuzzy search as fallback
  const {
    fuzzyMatches,
    setSearchQuery: setFuzzySearchQuery,
    isLoading: isFuzzySearchLoading,
  } = useFuzzySearch(drugs);

  const glowAnim = useGlowAnimation();

  // Update search queries when debounced value changes
  useEffect(() => {
    setNormalSearchQuery(debouncedSearchQuery);
    setFuzzySearchQuery(debouncedSearchQuery);
  }, [debouncedSearchQuery, setNormalSearchQuery, setFuzzySearchQuery]);

  const renderMedicationCard = ({ item }: LegendListRenderItemProps<Drug>) => (
    <MedicationCard item={item} />
  );

  const handleAcceptSuggestion = (suggestion: string) => {
    setInputValue(suggestion);
    setNormalSearchQuery(suggestion);
    setFuzzySearchQuery(suggestion);
  };

  // Determine what data to show:
  // 1. If no search query, show all drugs
  // 2. If normal search has results, show them
  // 3. If normal search has no results but fuzzy search does, show fuzzy results
  const hasNormalResults = filteredDrugs.length > 0;
  const shouldShowFuzzySearch =
    debouncedSearchQuery.trim() && !hasNormalResults && fuzzyMatches.length > 0;

  const displayData = hasNormalResults
    ? filteredDrugs
    : fuzzyMatches.map((result) => result.drug);

  return (
    <SafeAreaView className="flex-1 bg-gray-50 ">
      {/* Header Section */}
      <View className="px-6 pt-4 pb-6 backdrop-blur-lg">
        <Header />
        <SearchBar
          searchQuery={inputValue}
          onChangeText={setInputValue}
          glowAnim={glowAnim}
        />
      </View>
      {inputValue.length === 0 ? (
        <Text className="text-center text-gray-500 text-sm">
          You can Search now...
        </Text>
      ) : (
        <>
          {isNormalSearchLoading || isFuzzySearchLoading ? (
            <View className="flex-1 items-center justify-center -mt-60">
              <ActivityIndicator size="large" color="#663399" />
            </View>
          ) : (
            <>
              {/* Fuzzy Search Results - only show when normal search has no results */}
              {shouldShowFuzzySearch && (
                <FuzzySearchResults
                  results={fuzzyMatches}
                  searchQuery={debouncedSearchQuery}
                  onSelectResult={handleAcceptSuggestion}
                />
              )}

              {/* Medications List */}
              <View className="flex-1 ">
                <LegendList
                  data={displayData}
                  renderItem={renderMedicationCard}
                  showsVerticalScrollIndicator={false}
                  contentContainerStyle={{ paddingBottom: 120 }}
                  keyExtractor={(item: Drug) => item.id.toString()}
                  recycleItems={true}
                  maintainVisibleContentPosition
                />
              </View>
            </>
          )}
        </>
      )}
    </SafeAreaView>
  );
}
