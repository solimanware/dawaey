import { Stack } from "expo-router";
import React from "react";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="(modal)/medication-details"
        options={{
          title: "Medication Details",
          headerShown: false,
          presentation: "modal",
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
      <Stack.Screen
        name="(modal)/references"
        options={{
          title: "References",
          headerShown: false,
          presentation: "modal",
          contentStyle: {
            backgroundColor: "#fff",
          },
        }}
      />
    </Stack>
  );
}
