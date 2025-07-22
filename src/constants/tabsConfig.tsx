import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { TabIcon } from "../components/TabIcon";

export interface TabConfig {
  name: string;
  title: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconNameOutline: keyof typeof Ionicons.glyphMap;
}

export const TAB_CONFIGS: TabConfig[] = [
  {
    name: "index",
    title: "Medications",
    iconName: "medical",
    iconNameOutline: "medical-outline",
  },
  {
    name: "pharmacies",
    title: "Pharmacies",
    iconName: "business",
    iconNameOutline: "business-outline",
  },
  {
    name: "community",
    title: "Community",
    iconName: "chatbubbles",
    iconNameOutline: "chatbubbles-outline",
  },
  {
    name: "profile",
    title: "Profile",
    iconName: "person-circle",
    iconNameOutline: "person-circle-outline",
  },
];

export const createTabIcon = (config: TabConfig) => {
  return ({ color, focused }: { color: string; focused: boolean }) => (
    <TabIcon
      iconName={config.iconName}
      iconNameOutline={config.iconNameOutline}
      color={color}
      focused={focused}
    />
  );
};
