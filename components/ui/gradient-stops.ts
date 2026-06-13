import { type AccentName, type ThemeMode, getThemeTokens } from "@/lib/theme";

const NEXT_ACCENT: Record<AccentName, AccentName> = {
  gray: "pink",
  pink: "blue",
  blue: "gray",
};

function getCrossAccentStops(
  mode: ThemeMode,
  accent: AccentName,
): readonly [string, string, string] {
  const from = getThemeTokens(mode, accent);
  const to = getThemeTokens(mode, NEXT_ACCENT[accent]);
  return [from.primary, from.primary2, to.primary] as const;
}

export { getCrossAccentStops };
