import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Drug } from "../../hooks";

export default function MedicationDetailsModal() {
  const params = useLocalSearchParams();
  const [imageError, setImageError] = useState(false);

  // Parse the drug data from params
  const drug: Drug = {
    id: parseInt(params.id as string),
    type: params.type as string,
    tradename: params.tradename as string,
    activeingredient: params.activeingredient as string,
    company: params.company as string,
    group: params.group as string,
    price: params.price as string,
    form: params.form as string,
  };

  // Use default primary color for styling
  const primaryColor = "#2563eb";

  // Generate drug image URL based on ID
  const drugImageUrl = `https://soliman.ai/dawaey-app-pics/${drug.id}.jpg`;

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
    if (!drug.activeingredient) return [];
    return drug.activeingredient
      .split("+")
      .map((ingredient) => ingredient.trim());
  };

  const activeIngredients = getActiveIngredients();

  // Handle CTA button actions
  const handleShowAlternatives = () => {
    if (drug.activeingredient) {
      router.dismiss();
      // Navigate to main screen with activeingredient search
      router.push({
        pathname: "/(tabs)" as any,
        params: {
          searchQuery: drug.activeingredient,
          searchType: "alternatives",
        },
      });
    }
  };

  const handleShowSimilars = () => {
    if (drug.group) {
      router.dismiss();
      // Navigate to main screen with group search
      router.push({
        pathname: "/(tabs)" as any,
        params: {
          searchQuery: drug.group,
          searchType: "similars",
        },
      });
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 border-b border-gray-200">
          <View className="flex-1">
            <Text className="text-2xl font-bold text-gray-900">Medication Details</Text>
            <Text className="text-gray-600 mt-1">{drug.tradename}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => router.dismiss()}
            className="p-2 rounded-full bg-gray-100"
          >
            <Ionicons name="close" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>
        {/* Hero Section */}
        <View
          className="relative px-6 pt-6 pb-10"
          style={{
            backgroundColor: "#ffffff",
          }}
        >
          {/* Gradient Overlay */}
          <View
            className="absolute inset-0"
            style={{
              backgroundColor: `${primaryColor}05`,
            }}
          />
          {/* Decorative Background Elements */}
          <View
            className="absolute top-0 right-0 w-32 h-32 rounded-full opacity-30"
            style={{ backgroundColor: `${primaryColor}15` }}
          />
          <View
            className="absolute bottom-0 left-0 w-24 h-24 rounded-full opacity-20"
            style={{ backgroundColor: `${primaryColor}10` }}
          />

          <View className="flex-col items-center space-x-5">
            {/* Drug Image */}
            <View className="flex-shrink-0 relative">
              {!imageError ? (
                <View
                  className="p-1 shadow-lg"
                  style={{
                    backgroundColor: "white",
                    shadowColor: primaryColor,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <Image
                    source={{ uri: drugImageUrl }}
                    style={{ width: 130, height: 130 }}
                    className=" bg-gray-50"
                    contentFit="cover"
                    placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                    transition={300}
                    onError={() => setImageError(true)}
                  />
                </View>
              ) : (
                <View
                  className="w-32 h-32 rounded-tl-3xl rounded-tr-3xl rounded-bl-lg rounded-br-2xl items-center justify-center shadow-lg"
                  style={{
                    backgroundColor: `${primaryColor}15`,
                    shadowColor: primaryColor,
                    shadowOffset: { width: 0, height: 8 },
                    shadowOpacity: 0.15,
                    shadowRadius: 16,
                    elevation: 12,
                  }}
                >
                  <View
                    className="w-16 h-16 rounded-2xl items-center justify-center"
                    style={{ backgroundColor: `${primaryColor}25` }}
                  >
                    <Ionicons name="medical" size={32} color={primaryColor} />
                  </View>
                </View>
              )}
            </View>

            {/* Drug Information */}
            <View className="flex-1 pt-2">
              {/* Drug Name */}
              <Text className="text-2xl font-black text-gray-900 mb-1 leading-tight">
                {drug.tradename}
              </Text>

              {/* Active Ingredient Preview */}
              {drug.activeingredient && (
                <Text className="text-sm text-gray-500 mb-4 font-medium">
                  {drug.activeingredient.split("+")[0].trim()}
                  {drug.activeingredient.includes("+") ? " + more" : ""}
                </Text>
              )}

              {/* Price Section */}
              <View className="mb-4">
                <Text className="text-xs text-gray-400 font-semibold uppercase tracking-wider mb-1">
                  Price
                </Text>
                <View className="flex-row items-baseline">
                  <Text
                    className="text-4xl font-black tracking-tight"
                    style={{ color: primaryColor }}
                  >
                    {formatPrice(drug.price)}
                  </Text>
                  <Text className="text-lg text-gray-600 font-semibold ml-2">
                    EGP
                  </Text>
                </View>
              </View>

              {/* Form Badge */}
              <View className="flex-row">
                <View
                  className="px-4 py-2.5 rounded-2xl flex-row items-center shadow-sm"
                  style={{
                    backgroundColor: `${primaryColor}12`,
                    borderWidth: 1,
                    borderColor: `${primaryColor}25`,
                  }}
                >
                  <View
                    className="w-2 h-2 rounded-full mr-2"
                    style={{ backgroundColor: primaryColor }}
                  />
                  <Text
                    className="font-bold text-sm tracking-wide"
                    style={{ color: primaryColor }}
                  >
                    {drug.form || drug.type || "Unknown"}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          {/* Company Badge */}
          {drug.company && (
            <View className="mt-6 flex-row items-center">
              <View className="flex-1 h-px bg-gray-200" />
              <View className="mx-4 px-4 py-2 bg-white rounded-full shadow-sm border border-gray-100">
                <Text className="text-xs text-gray-600 font-semibold uppercase tracking-wider">
                  {drug.company}
                </Text>
              </View>
              <View className="flex-1 h-px bg-gray-200" />
            </View>
          )}
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
                    className="bg-white px-3 py-2 rounded-lg border-[1px] border-blue-200"
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
          {/* Drug Type */}
          {drug.type && (
            <View className="bg-gray-50 rounded-xl p-4">
              <View className="flex-row items-center mb-2">
                <Ionicons name="medical" size={20} color="#dc2626" />
                <Text className="text-lg font-semibold text-gray-900 ml-2">
                  Drug Type
                </Text>
              </View>
              <Text className="text-gray-700 text-base">{drug.type}</Text>
            </View>
          )}
        </View>

        {/* CTA Buttons Section */}
        {(drug.activeingredient || drug.group) && (
          <View className="px-6 mt-6 mb-8">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Find Related Medications
            </Text>
            <View className="space-y-3">
              {/* Show Alternatives Button */}
              {drug.activeingredient && (
                <TouchableOpacity
                  onPress={handleShowAlternatives}
                  className="bg-blue-500 rounded-xl p-4 flex-row items-center justify-between shadow-sm"
                  style={{
                    shadowColor: "#3b82f6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center mr-3">
                      <Ionicons name="flask" size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-base mb-1">
                        Show Alternatives
                      </Text>
                      <Text className="text-blue-100 text-sm">
                        Find medications with same active ingredient
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              )}

              {/* Show Similars Button */}
              {drug.group && (
                <TouchableOpacity
                  onPress={handleShowSimilars}
                  className="bg-purple-500 rounded-xl p-4 flex-row items-center justify-between shadow-sm  mt-4"
                  style={{
                    shadowColor: "#8b5cf6",
                    shadowOffset: { width: 0, height: 2 },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                  }}
                >
                  <View className="flex-row items-center flex-1">
                    <View className="w-10 h-10 bg-white/20 rounded-lg items-center justify-center mr-3">
                      <Ionicons name="library" size={20} color="white" />
                    </View>
                    <View className="flex-1">
                      <Text className="text-white font-semibold text-base mb-1">
                        Show Similar Medications
                      </Text>
                      <Text className="text-purple-100 text-sm">
                        Find medications in the same drug group
                      </Text>
                    </View>
                  </View>
                  <Ionicons name="chevron-forward" size={20} color="white" />
                </TouchableOpacity>
              )}
            </View>
          </View>
        )}

        {/* Bottom Spacing */}
        <View className="p-safe" />
      </ScrollView>
    </SafeAreaView>
  );
}
