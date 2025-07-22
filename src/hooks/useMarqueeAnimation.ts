import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useMarqueeAnimation = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    console.log("Marquee Animation Debug:", {
      containerWidth,
      textWidth,
      shouldAnimate,
      shouldStart:
        containerWidth > 0 && textWidth > containerWidth && shouldAnimate,
    });

    if (containerWidth > 0 && textWidth > containerWidth && shouldAnimate) {
      console.log("Starting marquee animation...");
      const startAnimation = () => {
        translateX.setValue(containerWidth);
        Animated.timing(translateX, {
          toValue: -textWidth - 20, // Extra padding for smooth loop
          duration: (textWidth + containerWidth) * 30, // Slow motion: 30ms per pixel
          useNativeDriver: true, // Changed back to true for better performance
        }).start(() => {
          // Restart animation for continuous loop
          startAnimation();
        });
      };
      startAnimation();
    }
  }, [containerWidth, textWidth, translateX, shouldAnimate]);

  const startMarquee = () => {
    console.log("startMarquee called");
    setShouldAnimate(true);
  };
  const stopMarquee = () => setShouldAnimate(false);

  const setContainerDimensions = (width: number) => {
    console.log("Container width set to:", width);
    setContainerWidth(width);
  };
  const setTextDimensions = (width: number) => {
    console.log("Text width set to:", width);
    setTextWidth(width);
  };

  return {
    translateX,
    containerWidth,
    textWidth,
    shouldAnimate,
    startMarquee,
    stopMarquee,
    setContainerDimensions,
    setTextDimensions,
  };
};
