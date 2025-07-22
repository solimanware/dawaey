import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import {
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PharmaciesScreen() {
  const pharmacies = [
    {
      name: "HealthCare Pharmacy",
      address: "123 Main St, Downtown",
      distance: "0.5 km",
      rating: 4.8,
      isOpen: true,
      openUntil: "10:00 PM",
      phone: "+1 234 567 8900",
    },
    {
      name: "City Medical Center",
      address: "456 Oak Ave, Midtown",
      distance: "1.2 km",
      rating: 4.6,
      isOpen: true,
      openUntil: "9:00 PM",
      phone: "+1 234 567 8901",
    },
    {
      name: "QuickMeds Express",
      address: "789 Pine Rd, Uptown",
      distance: "2.1 km",
      rating: 4.5,
      isOpen: false,
      openUntil: "Opens at 8:00 AM",
      phone: "+1 234 567 8902",
    },
    {
      name: "Family Drug Store",
      address: "321 Elm St, Westside",
      distance: "3.0 km",
      rating: 4.7,
      isOpen: true,
      openUntil: "11:00 PM",
      phone: "+1 234 567 8903",
    },
  ];

  const filterOptions = ["All", "Open Now", "24/7", "Delivery"];

  return (
    <LinearGradient
      colors={[
        "#663399", // Royal Purple
        "#7C3AED", // Violet-600
        "#8B5CF6", // Violet-500
        "#A855F7", // Purple-500
      ]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{ flex: 1 }}
    >
      <SafeAreaView className="flex-1">
        <ScrollView className="flex-1">
          {/* Header */}
          <View className="px-6 pt-4 pb-6 bg-white/10 backdrop-blur-lg">
            <View className="flex-row items-center justify-between mb-6">
              <View>
                <Text className="text-2xl font-bold text-white">
                  Pharmacies
                </Text>
                <Text className="text-white/80 mt-1">
                  Find nearby pharmacies
                </Text>
              </View>
              <TouchableOpacity className="p-3 bg-white/20 rounded-full">
                <Ionicons name="location" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Search Bar */}
            <View className="flex-row items-center bg-white/90 rounded-xl px-4 py-3 mb-4">
              <Ionicons name="search" size={20} color="#64748b" />
              <TextInput
                placeholder="Search pharmacies..."
                className="flex-1 ml-3 text-gray-900"
                placeholderTextColor="#64748b"
              />
              <TouchableOpacity>
                <Ionicons name="map" size={20} color="#64748b" />
              </TouchableOpacity>
            </View>

            {/* Filter Options */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filterOptions.map((filter, index) => (
                <TouchableOpacity
                  key={index}
                  className={`mr-3 px-4 py-2 rounded-full ${index === 0 ? "bg-white" : "bg-white/30"}`}
                >
                  <Text
                    className={`font-medium ${index === 0 ? "text-green-600" : "text-white"}`}
                  >
                    {filter}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>

          {/* Map Placeholder */}
          <View className="mx-6 mt-4 bg-green-100 rounded-xl h-40 items-center justify-center">
            <Ionicons name="map" size={48} color="#16a34a" />
            <Text className="text-green-600 font-medium mt-2">Map View</Text>
            <Text className="text-green-500 text-sm">Tap to view on map</Text>
          </View>

          {/* Pharmacies List */}
          <View className="px-6 mt-6">
            <View className="flex-row items-center justify-between mb-4">
              <Text className="text-lg font-semibold text-gray-900">
                Nearby Pharmacies
              </Text>
              <TouchableOpacity>
                <Text className="text-green-600 font-medium">Sort by</Text>
              </TouchableOpacity>
            </View>

            {pharmacies.map((pharmacy, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white rounded-xl p-4 mb-3 shadow-sm border border-gray-100"
              >
                <View className="flex-row justify-between items-start mb-3">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-gray-900 mb-1">
                      {pharmacy.name}
                    </Text>
                    <Text className="text-gray-600 mb-2">
                      {pharmacy.address}
                    </Text>
                    <View className="flex-row items-center">
                      <Ionicons name="star" size={16} color="#fbbf24" />
                      <Text className="text-gray-700 ml-1 mr-3">
                        {pharmacy.rating}
                      </Text>
                      <Ionicons
                        name="location-outline"
                        size={16}
                        color="#64748b"
                      />
                      <Text className="text-gray-600 ml-1">
                        {pharmacy.distance}
                      </Text>
                    </View>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${pharmacy.isOpen ? "bg-green-100" : "bg-red-100"}`}
                  >
                    <Text
                      className={`text-xs font-medium ${pharmacy.isOpen ? "text-green-600" : "text-red-600"}`}
                    >
                      {pharmacy.isOpen ? "Open" : "Closed"}
                    </Text>
                  </View>
                </View>

                <View className="flex-row items-center justify-between pt-3 border-t border-gray-100">
                  <Text className="text-gray-600 text-sm">
                    {pharmacy.openUntil}
                  </Text>
                  <View className="flex-row">
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-full mr-2">
                      <Ionicons name="call" size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-gray-100 rounded-full mr-2">
                      <Ionicons name="navigate" size={16} color="#64748b" />
                    </TouchableOpacity>
                    <TouchableOpacity className="p-2 bg-green-500 rounded-full">
                      <Ionicons name="storefront" size={16} color="white" />
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>

          <View className="h-6" />
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
