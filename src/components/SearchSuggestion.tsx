import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { FuzzySearchResult } from "../types/search";

interface SearchSuggestionProps {
  suggestion: FuzzySearchResult;
  onAcceptSuggestion: (suggestion: string) => void;
  searchQuery: string;
}

export const SearchSuggestion = ({
  suggestion,
  onAcceptSuggestion,
  searchQuery,
}: SearchSuggestionProps) => {
  const handleAccept = () => {
    onAcceptSuggestion(suggestion.matchedValue);
  };

  const getFieldDisplayName = (field: "tradename" | "activeIngredients") => {
    return field === "tradename" ? "medication name" : "active ingredient";
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query) return text;

    const regex = new RegExp(`(${query})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      if (part.toLowerCase() === query.toLowerCase()) {
        return (
          <Text
            key={index}
            className="bg-yellow-200 text-violet-900 font-semibold"
          >
            {part}
          </Text>
        );
      }
      return part;
    });
  };

  return (
    <View className="mx-6 mb-4 bg-gradient-to-r from-blue-50 to-violet-50 rounded-xl p-4 border border-blue-200/50">
      {/* Header */}
      <View className="flex-row items-center mb-3">
        <View className="p-2 bg-blue-100 rounded-full mr-3">
          <Ionicons name="bulb" size={18} color="#2563eb" />
        </View>
        <Text className="text-gray-600 text-sm flex-1">
          No exact matches found for "{searchQuery}"
        </Text>
      </View>

      {/* Suggestion */}
      <View className="mb-3">
        <Text className="text-gray-700 text-sm mb-2">
          Did you mean this {getFieldDisplayName(suggestion.matchedField)}?
        </Text>

        <TouchableOpacity
          onPress={handleAccept}
          className="bg-white rounded-lg p-3 border border-blue-200 flex-row items-center justify-between"
          style={{
            shadowColor: "#2563eb",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 2,
          }}
        >
          <View className="flex-1">
            <Text className="text-violet-900 font-medium text-base mb-1">
              {highlightMatch(suggestion.matchedValue, searchQuery)}
            </Text>
            <Text className="text-gray-500 text-xs">
              Found in: {suggestion.drug.tradename}
            </Text>
            <View className="flex-row items-center mt-1">
              <View className="h-1 w-8 bg-gradient-to-r from-blue-400 to-violet-400 rounded-full mr-2" />
              <Text className="text-xs text-gray-400">
                {Math.round(suggestion.score * 100)}% match
              </Text>
            </View>
          </View>

          <View className="p-2 bg-violet-100 rounded-full">
            <Ionicons name="arrow-forward" size={16} color="#7c3aed" />
          </View>
        </TouchableOpacity>
      </View>

      {/* Additional info */}
      <Text className="text-xs text-gray-500 text-center">
        Tap to search for this term instead
      </Text>
    </View>
  );
};
