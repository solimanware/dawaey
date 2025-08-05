import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Animated, TextInput, TouchableOpacity, View } from "react-native";
import { useTypewriter } from "../hooks";

interface SearchBarProps {
  searchQuery: string;
  onChangeText: (text: string) => void;
  onReset?: () => void;
  glowAnim: Animated.Value;
}

// Global flag to track if typewriter has completed in this app session
let hasTypewriterCompleted = false;

export const SearchBar = ({
  searchQuery,
  onChangeText,
  onReset,
  glowAnim,
}: SearchBarProps) => {
  const [shouldRunTypewriter, setShouldRunTypewriter] = useState(
    !hasTypewriterCompleted
  );

  const typewriterResult = useTypewriter({
    words: shouldRunTypewriter
      ? ["Panadol", "Confestal", "A*G*M*N", "Search any medication..."]
      : [],
    defaultText: "Search any medication...",
    typingSpeed: 120,
    deletingSpeed: 60,
    pauseDuration: 2000,
    cycles: 1,
  });

  // Mark typewriter as completed when it finishes
  useEffect(() => {
    if (typewriterResult.isComplete && shouldRunTypewriter) {
      hasTypewriterCompleted = true;
      setShouldRunTypewriter(false);
    }
  }, [typewriterResult.isComplete, shouldRunTypewriter]);



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
          placeholder={typewriterResult.displayText}
          className="flex-1 ml-3 text-gray-900"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={onChangeText}
          autoCapitalize="none"
          autoCorrect={false}
          autoComplete="off"
        />
        {searchQuery ? (
          <TouchableOpacity onPress={onReset || (() => onChangeText(""))}>
            <Ionicons name="close-circle" size={20} color="#663399" />
          </TouchableOpacity>
        ) : null}
      </View>
    </View>
  );
};
