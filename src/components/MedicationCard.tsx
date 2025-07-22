import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { Drug } from "../hooks/useDrugsData";

interface MedicationCardProps {
  item: Drug;
}

// Debug Marquee Animation Component
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
    needsAnimation: textWidth > containerWidth,
    canAnimate: containerWidth > 0 && textWidth > 0,
  });

  useEffect(() => {
    // Force animation for debugging - let's test with any text longer than 30 chars
    if (shouldAnimate && containerWidth > 50) {
      // Reduced threshold for testing
      console.log("🚀 Starting marquee animation with:", {
        containerWidth,
        textWidth,
        translateDistance:
          textWidth > containerWidth
            ? -(textWidth - containerWidth) - 20
            : -100,
      });

      const startMarquee = () => {
        // Clear any existing animation
        if (animationRef.current) {
          animationRef.current.stop();
        }

        // Reset position
        translateX.setValue(0);

        // Create a simple left-moving animation for testing
        const sequence = Animated.sequence([
          Animated.delay(1000), // Shorter delay for testing

          Animated.timing(translateX, {
            toValue: -200, // Fixed distance for testing
            duration: 4000, // 4 seconds
            useNativeDriver: true,
          }),

          Animated.delay(1000),
        ]);

        animationRef.current = Animated.loop(sequence);
        animationRef.current.start(() => {
          console.log("✅ Animation cycle completed");
        });
      };

      startMarquee();

      return () => {
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    }
  }, [shouldAnimate, containerWidth, translateX]);

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
    <View className="bg-yellow-100 border-2 border-red-500">
      {" "}
      {/* Visual debug container */}
      <Text className="text-xs text-red-600 mb-1">
        🐛 Container: {containerWidth}px | Text: {textWidth}px
      </Text>
      <View
        className="overflow-hidden bg-blue-100"
        style={{
          width: "100%",
          height: 40,
          borderWidth: 1,
          borderColor: "green",
        }}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          console.log("📏 Container width measured:", width);
          setContainerWidth(width);
        }}
      >
        <Animated.View
          className="flex-row items-center h-full bg-orange-200"
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
    rawActiveIngredient: item.activeingredient,
    activeIngredients,
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
