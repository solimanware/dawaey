import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, TouchableOpacity, View } from "react-native";
import { useAnalytics } from "../hooks";
import { Drug } from "../hooks/useDrugsData";

interface MedicationCardProps {
  item: Drug;
}

// Seamless Marquee Animation Component
const AnimatedMarquee = ({ ingredients }: { ingredients: string[] }) => {
  const translateX = useRef(new Animated.Value(0)).current;
  const [containerWidth, setContainerWidth] = useState(0);
  const [singleContentWidth, setSingleContentWidth] = useState(0);
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);

  const totalIngredientsText = ingredients.join(" + ");
  const shouldAnimate = totalIngredientsText.length > 30;

  //console.log("🔍 Seamless Marquee Debug:", {
  //   totalIngredientsText,
  //   textLength: totalIngredientsText.length,
  //   containerWidth,
  //   singleContentWidth,
  //   shouldAnimate,
  // });

  useEffect(() => {
    if (shouldAnimate && containerWidth > 50 && singleContentWidth > 0) {
      //console.log("🚀 Starting seamless marquee with exact calculations");

      const startSeamlessMarquee = () => {
        // Clear any existing animation
        if (animationRef.current) {
          animationRef.current.stop();
        }

        // Start from position 0
        translateX.setValue(0);

        // Move exactly one content width to the left for perfect seamless loop
        const timing = Animated.timing(translateX, {
          toValue: -singleContentWidth, // Move exactly one content block width
          duration: Math.max(8000, singleContentWidth * 25), // Smooth, readable speed
          useNativeDriver: true,
        });

        // Loop continuously for seamless effect
        animationRef.current = Animated.loop(timing);
        animationRef.current.start();
      };

      // Start animation after delay
      const timeoutId = setTimeout(startSeamlessMarquee, 2000);

      return () => {
        clearTimeout(timeoutId);
        if (animationRef.current) {
          animationRef.current.stop();
        }
      };
    }
  }, [shouldAnimate, containerWidth, singleContentWidth, translateX]);

  // If text is short, show normally
  if (!shouldAnimate) {
    return (
      <View className="flex-row flex-wrap gap-2">
        {ingredients.map((ingredient, index) => (
          <View
            key={`${ingredient}-${index}`}
            className="bg-white px-2 py-1 rounded-full border-[1px] border-primary-300"
          >
            <Text className="text-sm text-gray-700" numberOfLines={1}>
              {ingredient}
            </Text>
          </View>
        ))}
      </View>
    );
  }

  // Render single instance of ingredients for measurement
  const renderIngredients = (keyPrefix: string) =>
    ingredients.map((ingredient, index) => (
      <View
        key={`${keyPrefix}-${ingredient}-${index}`}
        className="mr-2 bg-white px-2 py-1 rounded-full border-[1px] border-primary-300"
        style={{ flexShrink: 0 }}
      >
        <Text
          className="text-sm text-gray-700"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {index + 1}- {ingredient}
        </Text>
      </View>
    ));

  return (
    <View className="overflow-hidden" style={{ width: "100%", height: 40 }}>
      <View
        className="overflow-hidden"
        style={{
          width: "100%",
          height: "100%",
        }}
        onLayout={(event) => {
          const width = event.nativeEvent.layout.width;
          //console.log("📏 Container width measured:", width);
          setContainerWidth(width);
        }}
      >
        {/* Hidden measurement view for single content width */}
        <View
          style={{ position: "absolute", opacity: 0, top: -1000 }}
          onLayout={(event) => {
            const width = event.nativeEvent.layout.width;
            //console.log("📐 Single content width measured:", width);
            setSingleContentWidth(width);
          }}
        >
          <View className="flex-row">{renderIngredients("measure")}</View>
        </View>

        <Animated.View
          className="flex-row items-center h-full"
          style={{
            transform: [{ translateX }],
          }}
        >
          {/* First instance */}
          {renderIngredients("first")}

          {/* Second instance - positioned immediately after first with no gap */}
          {renderIngredients("second")}

          {/* Third instance - for extra smoothness on very wide screens */}
          {renderIngredients("third")}
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
  const drugImageUrl = `https://soliman.ai/dawaey-app-pics/${item.id}.jpg`;

  // Track image loading state
  const [imageError, setImageError] = useState(false);

  // Analytics hook
  const analytics = useAnalytics();

  // Safely format price
  const formatPrice = (price: string): string => {
    if (!price || price === "") {
      return "N/A";
    }
    const numPrice = parseFloat(price);
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
      .map((ingredient) => ingredient.trim())
      .filter((ingredient) => ingredient.length > 0);
  };

  const activeIngredients = getActiveIngredients();
  const totalIngredientsText = activeIngredients.join(" + ");

  //console.log("💊 MedicationCard Debug:", {
  //   tradename: item.tradename,
  //   totalIngredientsText,
  //   textLength: totalIngredientsText.length,
  // });

  const handlePress = () => {
    // Track medication card interaction
    analytics.logMedicationView(item, "search_card");
    analytics.logMedicationDetailsOpened(item, "search_card");
    analytics.logSelectContent("medication", item.id.toString());
    analytics.logViewItem(item.id.toString(), item.tradename, "medication");

    router.push({
      pathname: "/(modal)/medication-details" as any,
      params: {
        id: item.id.toString(),
        tradename: item.tradename,
        activeingredient: item.activeingredient,
        company: item.company,
        group: item.group,
        info: item.info || "",
        form: item.form || item.type,
        type: item.type,
        price: item.price || "",
      },
    });
  };

  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 mb-4 mx-6 shadow-sm border-[1px] border-primary-500"
      onPress={handlePress}
    >
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
              onLoad={() => {
                analytics.logMedicationImageEvent(item.id, true);
              }}
              onError={() => {
                setImageError(true);
                analytics.logMedicationImageEvent(item.id, false);
              }}
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
                {item.form || item.type || "Unknown"}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
