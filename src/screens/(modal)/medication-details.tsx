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
    id: parseInt(params.id as string),
    type: params.type as string,
    tradename: params.tradename as string,
    activeingredient: params.activeingredient as string,
    company: params.company as string,
    group: params.group as string,
    price: params.price as string,
    form: params.form as string,
  };

  // Parse palette colors from comma-separated string
  const paletteColors = drug.palette ? drug.palette.split(",") : [];
  const primaryColor = paletteColors[0] || "#2563eb";

  // Generate drug image URL based on ID
  const drugImageUrl = `https://soliman.ai/z-drug-index/assets/drug-pics/${drug.id}.jpg`;

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Hero Section */}
        <View 
          className="relative px-6 pt-8 pb-10"
          style={{
            backgroundColor: '#ffffff',
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
          
          <View className="flex-row items-start space-x-5">
            {/* Drug Image */}
            <View className="flex-shrink-0 relative">
              {!imageError ? (
                <View 
                  className="rounded-3xl p-1 shadow-lg"
                  style={{ 
                    backgroundColor: 'white',
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
                    className="rounded-3xl bg-gray-50"
                    contentFit="cover"
                    placeholder={{ blurhash: "L6PZfSi_.AyE_3t7t7R**0o#DgR4" }}
                    transition={300}
                    onError={() => setImageError(true)}
                  />
                </View>
              ) : (
                <View
                  className="w-32 h-32 rounded-3xl items-center justify-center shadow-lg"
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
              
              {/* Quality Badge */}
              <View 
                className="absolute -top-2 -right-2 w-8 h-8 rounded-full items-center justify-center shadow-sm"
                style={{ backgroundColor: primaryColor }}
              >
                <Ionicons name="checkmark" size={16} color="white" />
              </View>
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
                  {drug.activeingredient.split('+')[0].trim()}
                  {drug.activeingredient.includes('+') ? ' + more' : ''}
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

        {/* Bottom Spacing */}
        <View className="p-safe" />
      </ScrollView>
    </SafeAreaView>
  );
}
