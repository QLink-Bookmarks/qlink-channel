import type { ExpoConfig } from "expo/config";

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "";
const appVariant = process.env.APP_VARIANT ?? "production";

const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
// Google's iOS redirect scheme is the client id reversed (REVERSED_CLIENT_ID in the plist).
const googleIosUrlScheme = googleIosClientId
  ? `com.googleusercontent.apps.${googleIosClientId.replace(".apps.googleusercontent.com", "")}`
  : "";

const config: ExpoConfig = {
  name: "qlink-channel",
  slug: "qlink-channel",
  scheme: "qlinkchannel",
  version: "1.0.0",
  orientation: "portrait",
  icon: "./assets/app_icon.png",
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: "com.qlinkapps.qlink",
    supportsTablet: true,
    infoPlist: {
      ITSAppUsesNonExemptEncryption: false,
    },
  },
  android: {
    package: "com.qlinkapps.qlink",
    adaptiveIcon: {
      foregroundImage: "./assets/app_icon.png",
      backgroundColor: "#FFFFFF",
    },
  },
  web: {
    favicon: "./assets/web_favicon.png",
    bundler: "metro",
    output: "static",
  },
  plugins: [
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 200,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "expo-build-properties",
      {
        android: {
          extraMavenRepos: ["https://devrepo.kakao.com/nexus/content/groups/public/"],
        },
      },
    ],
    [
      "@react-native-kakao/core",
      {
        nativeAppKey: kakaoNativeAppKey,
        android: {
          authCodeHandlerActivity: true,
        },
        ios: {
          handleKakaoOpenUrl: true,
        },
      },
    ],
    [
      "@react-native-google-signin/google-signin",
      {
        iosUrlScheme: googleIosUrlScheme,
      },
    ],
    "./plugins/with-ios-modular-headers",
  ],
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    appVariant,
  },
};

export default config;
