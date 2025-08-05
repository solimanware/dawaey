import { Stack } from "expo-router";
import React, { useEffect } from "react";

// Initialize Firebase
import "@react-native-firebase/app";

export default function RootLayout() {
  useEffect(() => {
    // Firebase is automatically initialized when importing @react-native-firebase/app
    // The configuration comes from your google-services.json and GoogleService-Info.plist files

    console.log("Firebase initialized successfully");
  }, []);

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
