import Constants from "expo-constants";

type AppVariant = "development" | "preview" | "production";

function getAppVariant(): string {
  return (Constants.expoConfig?.extra?.appVariant as string | undefined) ?? "production";
}

const WEB_APP_ORIGIN: Record<AppVariant, string> = {
  development: "http://localhost:8081",
  preview: "https://dev.qlinkapps.com",
  production: "https://qlinkapps.com",
};

function getWebAppOrigin(): string {
  return WEB_APP_ORIGIN[getAppVariant() as AppVariant] ?? WEB_APP_ORIGIN.production;
}

// Developer login is bundled but only surfaced outside production builds.
const isDevLoginEnabled = getAppVariant() !== "production";

export type { AppVariant };
export { getAppVariant, getWebAppOrigin, isDevLoginEnabled };
