import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useTypewriter } from "../hooks";

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  glowAnim: Animated.Value;
}

export const SearchBar = ({
  searchQuery,
  onChangeText,
  glowAnim,
}: SearchBarProps) => {
  const [shouldStartTypewriter, setShouldStartTypewriter] = useState(false);

  // Start typewriter effect after a small delay
  useEffect(() => {
    const timer = setTimeout(() => {
      setShouldStartTypewriter(true);
    }, 1000); // 1 second delay

    return () => clearTimeout(timer);
  }, []);

  const placeholderText = useTypewriter({
    words: shouldStartTypewriter
      ? ["Panadol", "Congestal", "A*G*M*N (wildcard)", "Search any medication..."]
      : [],
    defaultText: "Search any medication...",
    typingSpeed: 120,
    deletingSpeed: 60,
    pauseDuration: 2000,
    cycles: 1,
  });

  // Check if current search query is a wildcard pattern
  const isWildcardPattern = searchQuery.includes('*') && searchQuery.replace(/\*/g, '').length >= 2;

  return (
    <View className="relative">
      {/* Traveling Glow Effect */}
      <Animated.View
        className="absolute inset-0 rounded-full"
        style={{
          borderWidth: 2,
          borderColor: "transparent",
          shadowColor: "#663399",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: glowAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0.3, 1, 0.3],
          }),
          shadowRadius: glowAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [5, 25, 5],
          }),
          elevation: 15,
          backgroundColor: "rgba(102, 51, 153, 0.1)",
          transform: [
            {
              scale: glowAnim.interpolate({
                inputRange: [0, 0.5, 1],
                outputRange: [1, 1.02, 1],
              }),
            },
          ],
        }}
      />

      {/* Glass Border Effect */}
      <View
        className="absolute inset-0 rounded-full border-2"
        style={{
          borderColor: "rgba(255, 255, 255, 0.3)",
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          backdropFilter: "blur(10px)",
        }}
      />

      {/* Search Bar Content */}
      <View
        className="relative flex-row items-center bg-white rounded-full px-6 py-4 border border-white/20 z-10"
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.95)",
          shadowColor: "#663399",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <Ionicons name="search" size={20} color="#663399" />
        <TextInput
          placeholder={placeholderText}
          className="flex-1 ml-3 text-gray-900"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={() => onChangeText("")}>
            <Ionicons name="close-circle" size={20} color="#663399" />
          </TouchableOpacity>
        ) : null}
      </View>

      {/* Wildcard Search Hint */}
      {isWildcardPattern && (
        <View className="mt-2 px-3">
          <Text className="text-xs text-purple-600 font-medium">
            🔥 Wildcard Search: Use * for unknown letters (e.g., A*G*M*N → Augmentin)
          </Text>
        </View>
      )}
    </View>
  );
};
