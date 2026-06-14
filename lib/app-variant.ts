import Constants from "expo-constants";

type AppVariant = "development" | "preview" | "production";

function getAppVariant(): string {
  return (Constants.expoConfig?.extra?.appVariant as string | undefined) ?? "production";
}

// Developer login is bundled but only surfaced outside production builds.
const isDevLoginEnabled = getAppVariant() !== "production";

export type { AppVariant };
export { getAppVariant, isDevLoginEnabled };
