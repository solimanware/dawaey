import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { View } from "react-native";

interface TabIconProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameOutline: keyof typeof Ionicons.glyphMap;
  color: string;
  focused: boolean;
  size?: number;
}

export const TabIcon: React.FC<TabIconProps> = ({
  iconName,
  iconNameOutline,
  color,
  focused,
  size = 24,
}) => {
  return (
    <View
      style={{
        width: 44,
        height: 44,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 16,
        backgroundColor: focused ? "rgba(255, 255, 255, 0.25)" : "transparent",
        borderWidth: focused ? 1 : 0,
        borderColor: "rgba(255, 255, 255, 0.3)",
      }}
    >
      <Ionicons
        name={focused ? iconName : iconNameOutline}
        size={size}
        color={color}
        style={{
          shadowColor: focused ? "#FFFFFF" : "transparent",
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 6,
          shadowOpacity: 0.4,
        }}
      />
    </View>
  );
};
