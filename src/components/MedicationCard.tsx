import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Drug } from "../hooks/useDrugsData";

interface MedicationCardProps {
  item: Drug;
}

// Proper Marquee Animation Component
const AnimatedMarquee = ({ ingredients }: { ingredients: string[] }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [textWidth, setTextWidth] = useState(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const totalIngredientsText = ingredients.join(" + ");
  const shouldAnimate = totalIngredientsText.length > 30;

  console.log("🔍 AnimatedMarquee Debug:", {
    totalIngredientsText,
    textLength: totalIngredientsText.length,
    containerWidth,
    textWidth,
    shouldAnimate,
  });

  useEffect(() => {
    if (shouldAnimate && containerWidth > 50 && textWidth > 0) {
      console.log("🚀 Starting proper marquee animation");

      const startMarquee = () => {
        // Clear any existing animation
        if (animationRef.current) {
          animationRef.current.stop();
        }

        // Start from the right edge of container
        translateX.setValue(containerWidth);

        // Create continuous marquee animation
        const timing = Animated.timing(translateX, {
          toValue: -textWidth - 20, // Move completely off-screen to the left
          duration: Math.max(4000, (containerWidth + textWidth) * 15), // Adjust speed based on total distance
          useNativeDriver: true,
        });

        // Loop the animation continuously
        animationRef.current = Animated.loop(timing);
        animationRef.current.start();
      };

      // Start animation after a short delay
      const timeoutId = setTimeout(startMarquee, 1000);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    }
  }, [shouldAnimate, containerWidth, textWidth, translateX]);

  // If text is short, show normally
  if (!shouldAnimate) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <Text
            key={`${ingredient}-${index}`}
            className="text-sm p-1 text-gray-700 border-[1px] border-primary-300 rounded-full"
          >
            {ingredient}
          </Text>
        ))}
      </View>
    );
  }

  return (
    <View className="overflow-hidden" style={{ width: "100%", height: 32 }}>
      <View
        className="overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
        }}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          console.log("📏 Container width measured:", width);
          setContainerWidth(width);
        }}
      >
        <Animated.View
          className="flex-row items-center h-full"
          style={{
            transform: [{ translateX }],
          }}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            console.log("📏 Text width measured:", width);
            setTextWidth(width);
          }}
        >
          {ingredients.map((ingredient, index) => (
            <View
              key={`${ingredient}-${index}`}
              className="mr-2 bg-white px-2 py-1 rounded-full border border-primary-300"
              style={{ flexShrink: 0 }}
            >
              <Text className="text-sm text-gray-700">{ingredient}</Text>
            </View>
          ))}
        </Animated.View>
      </View>
    </View>
  );
};

export const MedicationCard = ({ item }: MedicationCardProps) => {
  // Parse palette colors from comma-separated string
  const paletteColors = item.palette ? item.palette.split(",") : [];
  const primaryColor = paletteColors[0] || "#2563eb";

  // Generate drug image URL based on ID
  const drugImageUrl = `https://soliman.ai/z-drug-index/assets/drug-pics/${item.id}.jpg`;

  // Track image loading state
  const [imageError, setImageError] = useState(false);

  // Safely format price
  const formatPrice = (price: number | string | undefined): string => {
    if (price === undefined || price === null || price === "") {
      return "N/A";
    }
    const numPrice = typeof price === "string" ? parseFloat(price) : price;
    if (isNaN(numPrice)) {
      return "N/A";
    }
    return numPrice.toFixed(2);
  };

  // Process active ingredients
  const getActiveIngredients = () => {
    if (!item.activeingredient) return [];
    return item.activeingredient
      .split("+")
      .map((ingredient) => ingredient.trim());
  };

  const activeIngredients = getActiveIngredients();
  const totalIngredientsText = activeIngredients.join(" + ");

  console.log("💊 MedicationCard Debug:", {
    tradename: item.tradename,
    totalIngredientsText,
    textLength: totalIngredientsText.length,
  });

  return (
    <TouchableOpacity className="bg-white rounded-2xl p-4 mb-4 mx-6 shadow-sm border-[1px] border-primary-500">
      <View className="flex-row">
        {/* Drug Image */}
        <View className="mr-4">
          {!imageError ? (
            <Image
              source={{ uri: drugImageUrl }}
              style={{ width: 80, height: 80 }}
              className="rounded-xl bg-gray-100"
              contentFit="cover"
              placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
              transition={200}
              onError={() => setImageError(true)}
            />
          ) : (
            <View
              className="w-20 h-20 rounded-xl items-center justify-center"
              style={{ backgroundColor: `${primaryColor}20` }}
            >
              <Ionicons name="medical" size={32} color={primaryColor} />
            </View>
          )}
        </View>

        {/* Drug Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <Text
              className="text-lg font-bold text-primary-600 flex-1 pr-2"
              numberOfLines={1}
            >
              {item.tradename}
            </Text>
          </View>

          {/* Active Ingredient */}
          {activeIngredients.length > 0 ? (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">
                Active Ingredient:
              </Text>
              <AnimatedMarquee ingredients={activeIngredients} />
            </View>
          ) : (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">
                Active Ingredient:
              </Text>
              <Text className="text-sm text-gray-700" numberOfLines={1}>
                Not specified
              </Text>
            </View>
          )}

          {/* Price and Form */}
          <View className="flex-row items-center justify-between">
            <Text className="text-xl font-bold text-danger-500">
              {formatPrice(item.price)} EGP
            </Text>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-xs text-gray-600 font-medium">
                {item.form || "Unknown"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
