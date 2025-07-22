import { useEffect, useRef, useState } from "react";
import { Animated } from "react-native";

export const useMarqueeAnimation = () => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (containerWidth > 0 && textWidth > containerWidth && shouldAnimate) {
      const startAnimation = () => {
        translateX.setValue(containerWidth);
        Animated.timing(translateX, {
          toValue: -textWidth - 20, // Extra padding for smooth loop
          duration: (textWidth + containerWidth) * 30, // Slow motion: 30ms per pixel
          useNativeDriver: false, // Following project's animation pattern
        }).start(() => {
          // Restart animation for continuous loop
          startAnimation();
        });
      };
      startAnimation();
    }
  }, [containerWidth, textWidth, translateX, shouldAnimate]);

  const startMarquee = () => setShouldAnimate(true);
  const stopMarquee = () => setShouldAnimate(false);

  const setContainerDimensions = (width: number) => setContainerWidth(width);
  const setTextDimensions = (width: number) => setTextWidth(width);

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
