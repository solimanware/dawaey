import React from "react";
import { useColorScheme } from "react-native";

import { Stack } from "expo-router";
import { TabBarBackground } from "../../components/TabBarBackground";
import {
  TAB_BAR_COLORS,
  TAB_BAR_ICON_STYLE,
  TAB_BAR_LABEL_STYLE,
  getTabBarStyle,
} from "../../constants/tabBarStyles";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const tabBarOptions = {
    tabBarActiveTintColor: TAB_BAR_COLORS.active,
    tabBarInactiveTintColor: TAB_BAR_COLORS.inactive,
    tabBarStyle: getTabBarStyle(),
    tabBarBackground: () => <TabBarBackground />,
    tabBarLabelStyle: TAB_BAR_LABEL_STYLE,
    tabBarIconStyle: TAB_BAR_ICON_STYLE,
    headerShown: false,
  };

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>

    // <Tabs screenOptions={tabBarOptions}>
    //   {TAB_CONFIGS.map((config) => (
    //     <Tabs.Screen
    //       key={config.name}
    //       name={config.name}
    //       options={{
    //         title: config.title,
    //         tabBarIcon: createTabIcon(config),
    //       }}
    //     />
    //   ))}
    // </Tabs>
  );
}
