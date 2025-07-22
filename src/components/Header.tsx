import { Ionicons } from "@expo/vector-icons";
import { Text, TouchableOpacity, View } from "react-native";

export const Header = () => {
  return (
    <View className="flex-row items-center justify-between mb-6">
      <View>
        <Text className="text-2xl font-bold text-violet-900">Medications</Text>
        <Text className="text-violet-700 mt-1">Find your medicines</Text>
      </View>
      <TouchableOpacity className="p-3 bg-violet-500 rounded-full">
        <Ionicons name="notifications-outline" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};
