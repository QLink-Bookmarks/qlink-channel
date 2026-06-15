import type { ExpoConfig } from "expo/config";

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "";
const appVariant = process.env.APP_VARIANT ?? "production";

const naverUrlScheme = process.env.EXPO_PUBLIC_NAVER_URL_SCHEME ?? "";
// Web host that serves invite links (e.g. "app.qlinkapps.com"). When set, enables
// iOS Universal Links / Android App Links so https invite URLs open the native app.
const webAppHost = process.env.EXPO_PUBLIC_WEB_APP_HOST ?? "";
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";
// Google's iOS redirect scheme is the client id reversed (REVERSED_CLIENT_ID in the plist).
const googleIosUrlScheme = googleIosClientId
  ? `com.googleusercontent.apps.${googleIosClientId.replace(".apps.googleusercontent.com", "")}`
  : "";

// Native social-login plugins validate their keys and throw on empty values.
// They are irrelevant to the web export (which runs in CI without these env
// vars), so only include them when the matching key is present.
const nativeAuthPlugins: NonNullable<ExpoConfig["plugins"]> = [];
if (kakaoNativeAppKey) {
  nativeAuthPlugins.push([
    "@react-native-kakao/core",
    {
      nativeAppKey: kakaoNativeAppKey,
      android: { authCodeHandlerActivity: true },
      ios: { handleKakaoOpenUrl: true },
    },
  ]);
}
if (googleIosUrlScheme) {
  nativeAuthPlugins.push([
    "@react-native-google-signin/google-signin",
    { iosUrlScheme: googleIosUrlScheme },
  ]);
}
if (naverUrlScheme) {
  nativeAuthPlugins.push(["@react-native-seoul/naver-login", { urlScheme: naverUrlScheme }]);
}

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
    // Universal Links: only enabled once the web host is set. Requires hosting
    // `/.well-known/apple-app-site-association` (see public/.well-known) and a native rebuild.
    ...(webAppHost ? { associatedDomains: [`applinks:${webAppHost}`] } : {}),
  },
  android: {
    package: "com.qlinkapps.qlink",
    adaptiveIcon: {
      foregroundImage: "./assets/app_icon.png",
      backgroundColor: "#FFFFFF",
    },
    // App Links: only enabled once the web host is set. Requires hosting
    // `/.well-known/assetlinks.json` (see public/.well-known) and a native rebuild.
    ...(webAppHost
      ? {
          intentFilters: [
            {
              action: "VIEW",
              autoVerify: true,
              data: [{ scheme: "https", host: webAppHost, pathPrefix: "/invite" }],
              category: ["BROWSABLE", "DEFAULT"],
            },
          ],
        }
      : {}),
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
    ...nativeAuthPlugins,
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
