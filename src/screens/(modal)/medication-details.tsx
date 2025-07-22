import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drug } from "../../hooks";

export default function MedicationDetailsModal() {
  const params = useLocalSearchParams();
  const [imageError, setImageError] = useState(false);

  // Parse the drug data from params
  const drug: Drug = {
    id: params.id as string,
    tradename: params.tradename as string,
    activeingredient: params.activeingredient as string,
    company: params.company as string,
    group: params.group as string,
    info: params.info as string,
    form: params.form as string,
    price: params.price as string,
    tradenamearabic: params.tradenamearabic as string,
    palette: params.palette as string,
  };

  // Parse palette colors from comma-separated string
  const paletteColors = drug.palette ? drug.palette.split(",") : [];
  const primaryColor = paletteColors[0] || "#2563eb";

  // Generate drug image URL based on ID
  const drugImageUrl = `https://soliman.ai/z-drug-index/assets/drug-pics/${drug.id}.jpg`;

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
    if (!drug.activeingredient) return [];
    return drug.activeingredient
      .split("+")
      .map((ingredient) => ingredient.trim());
  };

  const activeIngredients = getActiveIngredients();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View className="bg-gradient-to-b from-gray-50 to-white px-6 pt-6 pb-8">
          <View className="flex-row items-start space-x-4">
            {/* Drug Image */}
            <View className="flex-shrink-0">
              {!imageError ? (
                <Image
                  source={{ uri: drugImageUrl }}
                  style={{ width: 120, height: 120 }}
                  className="rounded-2xl bg-gray-100"
                  contentFit="cover"
                  placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                  transition={200}
                  onError={() => setImageError(true)}
                />
              ) : (
                <View
                  className="w-30 h-30 rounded-2xl items-center justify-center"
                  style={{ backgroundColor: `${primaryColor}20` }}
                >
                  <Ionicons name="medical" size={48} color={primaryColor} />
                </View>
              )}
            </View>

            {/* Basic Info */}
            <View className="flex-1">
              <Text className="text-2xl font-bold text-gray-900 mb-2">
                {drug.tradename}
              </Text>
              {drug.tradenamearabic && (
                <Text
                  className="text-lg text-gray-600 mb-3"
                  style={{ direction: "rtl" }}
                >
                  {drug.tradenamearabic}
                </Text>
              )}
              <View className="flex-row items-center justify-between">
                <Text className="text-3xl font-bold text-red-600">
                  {formatPrice(drug.price)} EGP
                </Text>
                <View className="bg-blue-100 px-3 py-2 rounded-full">
                  <Text className="text-blue-800 font-semibold text-sm">
                    {drug.form || "Unknown"}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Details Section */}
        <View className="px-6 space-y-6">
          {/* Active Ingredients */}
          {activeIngredients.length > 0 && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="flask" size={20} color="#4f46e5" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Active Ingredients
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {activeIngredients.map((ingredient, index) => (
                  <View
                    key={`${ingredient}-${index}`}
                    className="bg-white px-3 py-2 rounded-lg border border-blue-200"
                  >
                    <Text className="text-blue-800 font-medium">
                      {ingredient}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Company Information */}
          {drug.company && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="business" size={20} color="#059669" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Manufacturer
                </Text>
              </View>
              <Text className="text-gray-700 text-base">{drug.company}</Text>
            </View>
          )}

          {/* Drug Group */}
          {drug.group && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="library" size={20} color="#dc2626" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Drug Group
                </Text>
              </View>
              <Text className="text-gray-700 text-base">{drug.group}</Text>
            </View>
          )}

          {/* Additional Information */}
          {drug.info && drug.info.trim() !== "" && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="information-circle" size={20} color="#7c3aed" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Additional Information
                </Text>
              </View>
              <Text className="text-gray-700 text-base leading-6">
                {drug.info}
              </Text>
            </View>
          )}

          {/* Color Palette */}
          {paletteColors.length > 0 && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-3">
                <Ionicons name="color-palette" size={20} color="#ea580c" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Color Palette
                </Text>
              </View>
              <View className="flex-row space-x-2">
                {paletteColors.slice(0, 5).map((color, index) => (
                  <View
                    key={index}
                    className="w-8 h-8 rounded-full border-2 border-white shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Bottom Spacing */}
        <View className="h-8" />
      </ScrollView>
    </SafeAreaView>
  );
}
