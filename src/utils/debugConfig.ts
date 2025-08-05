/**
 * Debug configuration for Firebase Analytics
 * This file enables debug mode during development to verify events in Firebase DebugView
 */

import { __DEV__ } from "react-native";

/**
 * Enable Firebase Analytics debug mode in development
 * This must be called before accessing analytics for the first time
 */
export const enableFirebaseDebugMode = () => {
  if (__DEV__) {
    // For React Native Firebase "other" platform support (web/expo)
    if (typeof globalThis !== 'undefined') {
      globalThis.RNFBDebug = true;
    }
    
    console.log("🔥 Firebase Analytics debug mode enabled - events will appear in DebugView");
    console.log("📊 To view debug events:");
    console.log("  • iOS: Add -FIRAnalyticsDebugEnabled flag in Xcode scheme");
    console.log("  • Android: Run 'adb shell setprop debug.firebase.analytics.app app.dawaey'");
    console.log("  • Web/Expo: Debug events already enabled via globalThis.RNFBDebug");
  }
};

/**
 * Log analytics configuration for debugging
 */
export const logAnalyticsConfig = () => {
  if (__DEV__) {
    console.log("🔥 Firebase Analytics Configuration:");
    console.log("  • Auto-collection enabled:", true);
    console.log("  • Screen reporting enabled:", true);
    console.log("  • Debug mode enabled:", __DEV__);
    console.log("  • Bundle ID: app.dawaey");
    console.log("  • Project ID: dawaey-app-25");
  }
};