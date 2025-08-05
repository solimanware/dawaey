import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { FuzzySearchResult } from "../types/search";

interface FuzzySearchResultsProps {
  results: FuzzySearchResult[];
  searchQuery: string;
  onSelectResult: (suggestion: string) => void;
}

export const FuzzySearchResults = ({
  results,
  searchQuery,
  onSelectResult,
}: FuzzySearchResultsProps) => {
  if (results.length === 0) {
    return (
      <View className="mx-6 mb-4 bg-red-50 rounded-xl p-6 border border-red-200/50">
        <View className="flex-row items-center justify-center mb-3">
          <View className="p-2 bg-red-100 rounded-full mr-3">
            <Ionicons name="search" size={20} color="#dc2626" />
          </View>
          <Text className="text-red-700 font-medium">No matches found</Text>
        </View>
        <Text className="text-red-600 text-sm text-center">
          We couldn't find any medications matching "{searchQuery}". Try using
          different keywords or check the spelling.
        </Text>
      </View>
    );
  }

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

  const getFieldDisplayName = (field: "tradename" | "activeingredient") => {
    return field === "tradename" ? "medication" : "ingredient";
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.8) return "bg-green-400";
    if (score >= 0.6) return "bg-yellow-400";
    if (score >= 0.4) return "bg-orange-400";
    return "bg-red-400";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 0.8) return "Excellent match";
    if (score >= 0.6) return "Good match";
    if (score >= 0.4) return "Fair match";
    return "Weak match";
  };

  const predictedTradename =
    results[0].drug.tradename.split(" ")[0].charAt(0).toUpperCase() +
    results[0].drug.tradename.split(" ")[0].slice(1).toLowerCase();
  return (
    <View className="mx-6 mb-4">
      {/* Header */}
      <View className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-xl ">
        <View className="flex-row items-center mb-2">
          <View className="p-2 bg-amber-100 rounded-full mr-3">
            <Ionicons name="search" size={18} color="#f59e0b" />
          </View>
          <Text className="text-gray-700 font-medium flex-1">
            No exact matches for "{searchQuery}"
          </Text>
        </View>
        <View className="text-gray-600 text-sm mt-1 flex-row items-start justify-start">
          <Text className="text-gray-600 text-sm mt-1 flex-row items-center justify-center">
            Do You Mean{" "}
          </Text>
          <TouchableOpacity onPress={() => onSelectResult(predictedTradename)}>
            <Text className="text-primary-500  border-b-2 border-primary-500">
              {predictedTradename}
            </Text>
          </TouchableOpacity>
          <Text className="text-gray-600 text-sm mt-1 flex-row items-center justify-center">
            ?
          </Text>
        </View>
      </View>
    </View>
  );
};
