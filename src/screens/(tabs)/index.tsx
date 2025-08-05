import { Header, EnhancedSearchResults, SearchBar } from "@/components";
import { useDrugsData, useGlowAnimation, useEnhancedSearch } from "@/hooks";
import "@/theme/global.css";
import { useState } from "react";
import { Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function MedicationsScreen() {
  // Input state for immediate UI updates
  const [inputValue, setInputValue] = useState("");

  // Custom hooks
  const { drugs } = useDrugsData();
  const glowAnim = useGlowAnimation();

  // Enhanced search hook with wildcard support
  const { results, setSearchQuery, isLoading, searchMode: currentSearchMode, isWildcardQuery } = useEnhancedSearch(drugs);

  const handleInputChange = (text: string) => {
    setInputValue(text);
    setSearchQuery(text);
  };

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
          <Text className="text-center text-gray-400 text-xs mt-2">
            💡 Use wildcards: A*G*M*N to find Augmentin
          </Text>
        </View>
      ) : (
        <View className="flex-1 relative">
          <EnhancedSearchResults
            results={results}
            searchQuery={inputValue}
            isLoading={isLoading}
            searchMode={currentSearchMode}
            isWildcardQuery={isWildcardQuery}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
