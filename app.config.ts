import { ConfigContext, ExpoConfig } from "expo/config";

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: "dawaey",
  slug: "dawaey",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/images/icon.png",
  scheme: "dawaey",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  ios: {
    bundleIdentifier: "app.dawaey",
    supportsTablet: true,
    googleServicesFile: "./GoogleService-Info.plist", // <-- REQUIRED for analytics/app module
  },
  android: {
    package: "app.dawaey",
    adaptiveIcon: {
      foregroundImage: "./assets/images/adaptive-icon.png",
      backgroundColor: "#ffffff",
    },
    edgeToEdgeEnabled: true,
    googleServicesFile: "./google-services.json", // <-- REQUIRED for analytics/app module
  },
  web: {
    bundler: "metro",
    output: "static",
    favicon: "./assets/images/favicon.png",
  },
  plugins: [
    "expo-router",
    "expo-asset",
    [
      "expo-splash-screen",
      {
        image: "./assets/images/splash-icon.png",
        imageWidth: 200,
        resizeMode: "cover",
        backgroundColor: "#FFBDFF",
      },
    ],
    "@react-native-firebase/app",
    [
      "expo-build-properties",
      {
        ios: {
          useFrameworks: "static",
        },
      },
    ],
    "expo-dev-client",
  ],
  experiments: {
    typedRoutes: true,
  },
  extra: {
    router: {},
  },
});
