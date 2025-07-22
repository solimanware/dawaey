import { useEffect, useRef } from "react";
import { Animated } from "react-native";

export const useGlowAnimation = () => {
  const glowAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startGlow = () => {
      glowAnim.setValue(0);
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: false,
      }).start(() => startGlow());
    };
    startGlow();
  }, [glowAnim]);

  return glowAnim;
};
