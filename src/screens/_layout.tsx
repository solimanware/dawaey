import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, useColorScheme, View } from "react-native";

// Custom Tab Bar Background Component
const TabBarBackground = () => {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={[
          "#663399", // Royal Purple
          "#7C3AED", // Violet-600
          "#8B5CF6", // Violet-500
          "#A855F7", // Purple-500
        ]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      />
      {/* Subtle overlay for depth */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(255, 255, 255, 0.1)",
          borderTopLeftRadius: 25,
          borderTopRightRadius: 25,
        }}
      />
      {/* Top highlight line */}
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 20,
          right: 20,
          height: 2,
          backgroundColor: "rgba(255, 255, 255, 0.3)",
          borderRadius: 1,
        }}
      />
    </View>
  );
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const tabBarOptions = {
    tabBarActiveTintColor: "#FFFFFF", // Pure white for active
    tabBarInactiveTintColor: "rgba(255, 255, 255, 0.6)", // Semi-transparent white
    tabBarStyle: {
      backgroundColor: "transparent", // Make transparent to show gradient
      borderTopWidth: 0, // Remove default border
      height: Platform.OS === "ios" ? 95 : 85,
      paddingBottom: Platform.OS === "ios" ? 30 : 15,
      paddingTop: 15,
      paddingHorizontal: 10,
      position: "absolute" as const,
      bottom: 0,
      left: 0,
      right: 0,
      elevation: 0, // Remove shadow on Android
      // Add custom shadow
      shadowColor: "#663399",
      shadowOffset: {
        width: 0,
        height: -8,
      },
      shadowRadius: 20,
      shadowOpacity: 0.3,
    },
    tabBarBackground: () => <TabBarBackground />,
    tabBarLabelStyle: {
      fontSize: 11,
      fontWeight: "700" as const,
      marginTop: 4,
      textShadowColor: "rgba(0, 0, 0, 0.3)",
      textShadowOffset: { width: 0, height: 1 },
      textShadowRadius: 2,
    },
    tabBarIconStyle: {
      marginTop: 0,
      marginBottom: 8,
    },
    headerShown: false,
  };

  return (
    <Tabs screenOptions={tabBarOptions}>
      <Tabs.Screen
        name="index"
        options={{
          title: "Medications",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons
                name={focused ? "medical" : "medical-outline"}
                size={24}
                color={color}
                style={{
                  shadowColor: focused ? "#FFFFFF" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  shadowOpacity: 0.4,
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="pharmacies"
        options={{
          title: "Pharmacies",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons
                name={focused ? "business" : "business-outline"}
                size={24}
                color={color}
                style={{
                  shadowColor: focused ? "#FFFFFF" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  shadowOpacity: 0.4,
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="community"
        options={{
          title: "Community",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={24}
                color={color}
                style={{
                  shadowColor: focused ? "#FFFFFF" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  shadowOpacity: 0.4,
                }}
              />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, size, focused }) => (
            <View
              style={{
                width: 44,
                height: 44,
                justifyContent: "center",
                alignItems: "center",
                borderRadius: 16,
                backgroundColor: focused
                  ? "rgba(255, 255, 255, 0.25)"
                  : "transparent",
                borderWidth: focused ? 1 : 0,
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
            >
              <Ionicons
                name={focused ? "person-circle" : "person-circle-outline"}
                size={24}
                color={color}
                style={{
                  shadowColor: focused ? "#FFFFFF" : "transparent",
                  shadowOffset: { width: 0, height: 2 },
                  shadowRadius: 6,
                  shadowOpacity: 0.4,
                }}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
