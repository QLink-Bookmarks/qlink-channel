const { getDefaultConfig } = require("expo/metro-config");

const defaultConfig = getDefaultConfig(__dirname);

const { withStorybook } = require("@storybook/react-native/metro/withStorybook");
const { withNativeWind } = require("nativewind/metro");
const { withShareExtension } = require("expo-share-extension/metro");

const config = withStorybook(
  withNativeWind(defaultConfig, { input: "./global.css", inlineRem: 16 }),
  {
    enabled: process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true",
  },
);

const shareConfig = withShareExtension(config);

const baseRewrite = shareConfig.server.rewriteRequestUrl ?? ((url) => url);
shareConfig.server.rewriteRequestUrl = (url) => {
  if (url.includes("shareExtension=true")) {
    return url.replace(
      /\/(?:\.expo\/\.virtual-metro-entry|index)\.bundle/,
      "/share/index.share.bundle",
    );
  }
  return baseRewrite(url);
};

module.exports = shareConfig;
