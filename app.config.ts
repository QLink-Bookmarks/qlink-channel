import type { ExpoConfig } from "expo/config";

const kakaoNativeAppKey = process.env.EXPO_PUBLIC_KAKAO_NATIVE_KEY ?? "";
const appVariant = process.env.APP_VARIANT ?? "production";

const naverUrlScheme = process.env.EXPO_PUBLIC_NAVER_URL_SCHEME ?? "";
// Host for iOS Universal Links / Android App Links, pinned per variant to match
// getWebAppOrigin (lib/app-variant.ts) so https invite URLs open the native app.
// Enabled for preview (dev.qlinkapps.com) first; production is added once preview
// is verified. development uses localhost:PORT, which can't host Universal Links.
// EXPO_PUBLIC_WEB_APP_HOST overrides when present.
const webAppHost =
  process.env.EXPO_PUBLIC_WEB_APP_HOST || (appVariant === "preview" ? "dev.qlinkapps.com" : "");
const googleIosClientId = process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID ?? "";

// Firebase native config files. Local builds read them from ./ga; EAS cloud builds
// override the path via file env vars (eas secret:create --type file).
const iosGoogleServicesFile =
  process.env.GOOGLE_SERVICES_INFO_PLIST ?? "./ga/GoogleService-Info.plist";
const androidGoogleServicesFile = process.env.GOOGLE_SERVICES_JSON ?? "./ga/google-services.json";
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
  name: "QLink",
  slug: "qlink-channel",
  owner: "qlink1004",
  scheme: "qlinkchannel",
  version: "1.0.0",
  description: "북마크마저 간편하게, 스마트하게",
  orientation: "portrait",
  icon: "./assets/app_icon.png",
  userInterfaceStyle: "automatic",
  ios: {
    bundleIdentifier: "com.qlinkapps.qlink",
    supportsTablet: true,
    usesAppleSignIn: true,
    googleServicesFile: iosGoogleServicesFile,
    infoPlist: {
      CFBundleDisplayName: "큐링크",
      ITSAppUsesNonExemptEncryption: false,
      NSCameraUsageDescription: "QR 코드를 스캔하려면 카메라 접근 권한이 필요해요.",
      UIBackgroundModes: ["remote-notification"],
    },
    // Universal Links: only enabled once the web host is set. Requires hosting
    // `/.well-known/apple-app-site-association` (see public/.well-known) and a native rebuild.
    ...(webAppHost ? { associatedDomains: [`applinks:${webAppHost}`] } : {}),
  },
  android: {
    package: "com.qlinkapps.qlink",
    googleServicesFile: androidGoogleServicesFile,
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
    shortName: "QLink",
    lang: "ko",
    display: "standalone",
    themeColor: "#6B7280",
    backgroundColor: "#FFFFFF",
    description: "북마크마저 간편하게, 스마트하게",
  },
  plugins: [
    // Must stay first: expo-build-properties' forceStaticLinking array is dropped from
    // Podfile.properties.json if another plugin invocation overrides it later.
    [
      "expo-build-properties",
      {
        ios: {
          // @react-native-firebase requires static frameworks on iOS. forceStaticLinking
          // keeps prebuilt React Native (fast builds) while linking the RNFB pod statically,
          // which avoids the prebuilt-RN modulemap incompatibility with use_frameworks.
          // Ref: invertase/react-native-firebase#8657, expo/expo#39742
          useFrameworks: "static",
          // Every RNFB pod that imports another RNFB pod's module must also be static,
          // otherwise a framework target fails importing the now-static RNFBApp module.
          forceStaticLinking: ["RNFBApp", "RNFBAnalytics"],
        },
        android: {
          extraMavenRepos: ["https://devrepo.kakao.com/nexus/content/groups/public/"],
        },
      },
    ],
    "expo-router",
    [
      "expo-splash-screen",
      {
        image: "./assets/splash-icon.png",
        imageWidth: 260,
        resizeMode: "contain",
        backgroundColor: "#ffffff",
      },
    ],
    "@react-native-community/datetimepicker",
    [
      "expo-image-picker",
      {
        photosPermission: "프로필 사진을 변경하려면 사진 보관함 접근 권한이 필요해요.",
      },
    ],
    "@react-native-firebase/app",
    "@react-native-firebase/analytics",
    [
      "expo-share-intent",
      {
        disableIOS: true,
        androidIntentFilters: ["text/*"],
      },
    ],
    [
      "expo-share-extension",
      {
        height: 380,
        excludedPackages: [
          "expo-dev-client",
          "expo-splash-screen",
          "expo-updates",
          "@react-native-firebase/app",
          "@react-native-firebase/analytics",
        ],
        preprocessingFile: "./share/share-preprocessing.js",
        activationRules: [{ type: "url" }, { type: "text" }],
      },
    ],
    "./plugins/with-share-extension-rn-imports",
    ...nativeAuthPlugins,
    "expo-apple-authentication",
    "./plugins/with-ios-modular-headers",
  ],
  experiments: {
    reactCompiler: true,
    typedRoutes: true,
    tsconfigPaths: true,
  },
  extra: {
    appVariant,
    eas: {
      projectId: "8db7fe80-f9ba-4ffd-ab77-14708cabd390",
    },
  },
  updates: {
    url: "https://u.expo.dev/8db7fe80-f9ba-4ffd-ab77-14708cabd390",
  },
  runtimeVersion: {
    policy: "appVersion",
  },
};

export default config;
