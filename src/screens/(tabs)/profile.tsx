import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import { ScrollView, Switch, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAnalytics } from "../../hooks";

export default function ProfileScreen() {
  const analytics = useAnalytics();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  // Screen tracking
  useFocusEffect(
    useCallback(() => {
      analytics.logScreenView(analytics.SCREEN_NAMES.PROFILE);
      analytics.logEvent(analytics.ANALYTICS_EVENTS.PROFILE_VIEWED, {
        context: 'screen_opened',
      });
    }, [analytics])
  );

  const menuItems = [
    {
      title: "Medical History",
      icon: "document-text",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Prescriptions",
      icon: "receipt",
      color: "text-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Insurance Info",
      icon: "shield-checkmark",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Emergency Contacts",
      icon: "call",
      color: "text-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const settingsItems = [
    { title: "Privacy & Security", icon: "lock-closed", hasSwitch: false },
    { title: "Payment Methods", icon: "card", hasSwitch: false },
    { title: "Language", icon: "language", hasSwitch: false, value: "English" },
    { title: "Help & Support", icon: "help-circle", hasSwitch: false },
    { title: "About", icon: "information-circle", hasSwitch: false },
  ];

  const healthStats = [
    { label: "Medications", value: "8", icon: "medical", color: "bg-blue-500" },
    {
      label: "Refills Due",
      value: "3",
      icon: "refresh",
      color: "bg-orange-500",
    },
    { label: "Doctors", value: "2", icon: "person", color: "bg-green-500" },
    { label: "Visits", value: "12", icon: "calendar", color: "bg-purple-500" },
  ];

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
              <Text className="text-2xl font-bold text-white">Profile</Text>
              <TouchableOpacity className="p-3 bg-white/20 rounded-full">
                <Ionicons name="settings" size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* User Info */}
            <View className="flex-row items-center mb-6">
              <View className="w-20 h-20 bg-white/20 rounded-full items-center justify-center mr-4">
                <Text className="text-3xl">👤</Text>
              </View>
              <View className="flex-1">
                <Text className="text-xl font-bold text-white">John Smith</Text>
                <Text className="text-white/80 mt-1">john.smith@email.com</Text>
                <Text className="text-white/60 text-sm mt-1">
                  Patient ID: #DW2024001
                </Text>
              </View>
              <TouchableOpacity className="p-2">
                <Ionicons name="pencil" size={20} color="white" />
              </TouchableOpacity>
            </View>

            {/* Health Stats */}
            <View className="flex-row justify-between">
              {healthStats.map((stat, index) => (
                <View key={index} className="items-center">
                  <View
                    className={`w-12 h-12 ${stat.color} rounded-full items-center justify-center mb-2`}
                  >
                    <Ionicons name={stat.icon as any} size={20} color="white" />
                  </View>
                  <Text className="text-lg font-bold text-white">
                    {stat.value}
                  </Text>
                  <Text className="text-white/70 text-xs text-center">
                    {stat.label}
                  </Text>
                </View>
              ))}
            </View>
          </View>

          {/* Quick Actions */}
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Quick Access
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {menuItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center py-3 ${index !== menuItems.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => {
                    analytics.logEvent('profile_menu_item_pressed', {
                      menu_item: item.title,
                      icon: item.icon,
                    });
                  }}
                >
                  <View
                    className={`w-10 h-10 ${item.bgColor} rounded-full items-center justify-center mr-4`}
                  >
                    <Ionicons
                      name={item.icon as any}
                      size={20}
                      color={
                        item.color.includes("blue")
                          ? "#2563eb"
                          : item.color.includes("green")
                            ? "#16a34a"
                            : item.color.includes("purple")
                              ? "#7c3aed"
                              : "#dc2626"
                      }
                    />
                  </View>
                  <Text className="flex-1 text-gray-900 font-medium">
                    {item.title}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#64748b" />
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Settings */}
          <View className="px-6 mt-6">
            <Text className="text-lg font-semibold text-gray-900 mb-4">
              Settings
            </Text>
            <View className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
              {/* Notifications */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-yellow-50 rounded-full items-center justify-center mr-4">
                    <Ionicons name="notifications" size={20} color="#eab308" />
                  </View>
                  <Text className="text-gray-900 font-medium">
                    Notifications
                  </Text>
                </View>
                <Switch
                  value={notificationsEnabled}
                  onValueChange={(value) => {
                    setNotificationsEnabled(value);
                    analytics.logEvent(analytics.ANALYTICS_EVENTS.SETTINGS_CHANGED, {
                      setting: 'notifications',
                      enabled: value,
                    });
                  }}
                  trackColor={{ false: "#f3f4f6", true: "#3b82f6" }}
                  thumbColor={notificationsEnabled ? "#ffffff" : "#9ca3af"}
                />
              </View>

              {/* Dark Mode */}
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <View className="flex-row items-center">
                  <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                    <Ionicons name="moon" size={20} color="#6b7280" />
                  </View>
                  <Text className="text-gray-900 font-medium">Dark Mode</Text>
                </View>
                <Switch
                  value={darkModeEnabled}
                  onValueChange={(value) => {
                    setDarkModeEnabled(value);
                    analytics.logEvent(analytics.ANALYTICS_EVENTS.SETTINGS_CHANGED, {
                      setting: 'dark_mode',
                      enabled: value,
                    });
                  }}
                  trackColor={{ false: "#f3f4f6", true: "#3b82f6" }}
                  thumbColor={darkModeEnabled ? "#ffffff" : "#9ca3af"}
                />
              </View>

              {/* Other Settings */}
              {settingsItems.map((item, index) => (
                <TouchableOpacity
                  key={index}
                  className={`flex-row items-center justify-between py-3 ${index !== settingsItems.length - 1 ? "border-b border-gray-100" : ""}`}
                  onPress={() => {
                    analytics.logEvent('profile_settings_item_pressed', {
                      setting_item: item.title,
                      icon: item.icon,
                      has_value: !!item.value,
                    });
                  }}
                >
                  <View className="flex-row items-center">
                    <View className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center mr-4">
                      <Ionicons
                        name={item.icon as any}
                        size={20}
                        color="#6b7280"
                      />
                    </View>
                    <Text className="text-gray-900 font-medium">
                      {item.title}
                    </Text>
                  </View>
                  <View className="flex-row items-center">
                    {item.value && (
                      <Text className="text-gray-500 mr-2">{item.value}</Text>
                    )}
                    <Ionicons
                      name="chevron-forward"
                      size={16}
                      color="#64748b"
                    />
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Logout */}
          <View className="px-6 mt-6 mb-8">
            <TouchableOpacity 
              className="bg-red-50 rounded-xl p-4 flex-row items-center justify-center"
              onPress={() => {
                analytics.logEvent('user_sign_out', {
                  source: 'profile_screen',
                });
              }}
            >
              <Ionicons name="log-out" size={20} color="#dc2626" />
              <Text className="text-red-600 font-semibold ml-2">Sign Out</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </LinearGradient>
  );
}
