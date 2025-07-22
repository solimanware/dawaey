import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";
import { Drug } from "../hooks/useDrugsData";

interface MedicationCardProps {
  item: Drug;
}

export const MedicationCard = ({ item }: MedicationCardProps) => {
  // Parse palette colors from comma-separated string
  const paletteColors = item.palette ? item.palette.split(",") : [];
  const primaryColor = paletteColors[0] || "#2563eb";

  return (
    <TouchableOpacity className="bg-white rounded-2xl p-4 mb-4 mx-6 shadow-sm border border-gray-100">
      <View className="flex-row">
        {/* Drug Image - placeholder since image field is not available */}
        <View className="mr-4">
          <View
            className="w-20 h-20 rounded-xl items-center justify-center"
            style={{ backgroundColor: `${primaryColor}20` }}
          >
            <Ionicons name="medical" size={32} color={primaryColor} />
          </View>
        </View>

        {/* Drug Info */}
        <View className="flex-1">
          <View className="flex-row items-start justify-between mb-2">
            <Text
              className="text-lg font-bold text-gray-900 flex-1 pr-2"
              numberOfLines={1}
            >
              {item.tradename}
            </Text>
            <TouchableOpacity className="p-2 bg-blue-50 rounded-full">
              <Ionicons name="add" size={20} color="#2563eb" />
            </TouchableOpacity>
          </View>

          {/* Active Ingredient */}
          {item.activeingredient ? (
            <View className="mb-3">
              <Text className="text-xs text-gray-500 mb-1">
                Active Ingredient:
              </Text>
              <Text className="text-sm text-gray-700" numberOfLines={1}>
                {item.activeingredient}
              </Text>
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
            <Text className="text-xl font-bold text-blue-600">
              EGP {item.price.toFixed(2)}
            </Text>
            <View className="bg-gray-100 px-3 py-1 rounded-full">
              <Text className="text-xs text-gray-600 font-medium">
                {item.form}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};
