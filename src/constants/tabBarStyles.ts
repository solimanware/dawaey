import { Platform } from "react-native";

export const TAB_BAR_COLORS = {
  active: "#FFFFFF",
  inactive: "rgba(255, 255, 255, 0.6)",
  shadowColor: "#663399",
} as const;

export const TAB_BAR_DIMENSIONS = {
  height: Platform.OS === "ios" ? 95 : 85,
  paddingBottom: Platform.OS === "ios" ? 30 : 15,
  paddingTop: 15,
  paddingHorizontal: 10,
  iconContainerSize: 44,
  iconSize: 24,
  borderRadius: 16,
} as const;

export const getTabBarStyle = () => ({
  backgroundColor: "transparent",
  borderTopWidth: 0,
  height: TAB_BAR_DIMENSIONS.height,
  paddingBottom: TAB_BAR_DIMENSIONS.paddingBottom,
  paddingTop: TAB_BAR_DIMENSIONS.paddingTop,
  paddingHorizontal: TAB_BAR_DIMENSIONS.paddingHorizontal,
  position: "absolute" as const,
  bottom: 0,
  left: 0,
  right: 0,
  elevation: 0,
  shadowColor: TAB_BAR_COLORS.shadowColor,
  shadowOffset: {
    width: 0,
    height: -8,
  },
  shadowRadius: 20,
  shadowOpacity: 0.3,
});

export const TAB_BAR_LABEL_STYLE = {
  fontSize: 11,
  fontWeight: "700" as const,
  marginTop: 4,
  textShadowColor: "rgba(0, 0, 0, 0.3)",
  textShadowOffset: { width: 0, height: 1 },
  textShadowRadius: 2,
};

export const TAB_BAR_ICON_STYLE = {
  marginTop: 0,
  marginBottom: 8,
};
