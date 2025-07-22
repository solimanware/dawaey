import { LinearGradient } from "expo-linear-gradient";
import React from "react";
import { View } from "react-native";

export const TabBarBackground = () => {
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
