const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

// Add .txt files to asset extensions so they can be imported
config.resolver.assetExts.push("txt");

module.exports = withNativeWind(config, { input: "./src/theme/global.css" });
