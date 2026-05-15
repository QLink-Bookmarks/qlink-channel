const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const { withStorybook } = require("@storybook/react-native/metro/withStorybook");
const { withNativeWind } = require("nativewind/metro");

const config = withStorybook(
  withNativeWind(defaultConfig, { input: "./global.css", inlineRem: 16 }),
  {
    enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  },
);

module.exports = config;
