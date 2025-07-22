import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useMarqueeAnimation } from "../hooks";
import { Drug } from "../hooks/useDrugsData";

interface MedicationCardProps {
  item: Drug;
}

// Animated Marquee Component
const AnimatedMarquee = ({ ingredients }: { ingredients: string[] }) => {
  const {
    translateX,
    setContainerDimensions,
    setTextDimensions,
    startMarquee,
  } = useMarqueeAnimation();

  const totalIngredientsText = ingredients.join(" + ");

  useEffect(() => {
    if (totalIngredientsText.length > 30) {
      startMarquee();
    }
  }, [totalIngredientsText, startMarquee]);

  return (
    <View
      className="overflow-hidden"
      onLayout={(event) =>
        setContainerDimensions(event.nativeEvent.layout.width)
      }
    >
      <Animated.View
        className="flex-row"
        style={{
          transform: [{ translateX }],
        }}
        onLayout={(event) => setTextDimensions(event.nativeEvent.layout.width)}
      >
        {ingredients.map((ingredient, index) => (
          <Text
            key={`${ingredient}-${index}`}
            className="text-sm p-1 text-gray-700 border-[1px] border-primary-300 rounded-full mr-2"
          >
            {ingredient}
          </Text>
        ))}
      </Animated.View>
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
  const shouldAnimate = totalIngredientsText.length > 30;

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
              {shouldAnimate ? (
                <AnimatedMarquee ingredients={activeIngredients} />
              ) : (
                <View className="flex-row flex-wrap gap-2">
                  {activeIngredients.map((ingredient, index) => (
                    <Text
                      key={`${ingredient}-${index}`}
                      className="text-sm p-1 text-gray-700 border-[1px] border-primary-300 rounded-full"
                    >
                      {ingredient}
                    </Text>
                  ))}
                </View>
              )}
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
