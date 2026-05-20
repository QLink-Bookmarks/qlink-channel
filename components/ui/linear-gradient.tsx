import { type AccentName, DEFAULT_ACCENT, type ThemeMode, getThemeTokens } from "@/lib/theme";

import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";

type LinearGradientProps = Omit<React.ComponentProps<typeof ExpoLinearGradient>, "colors"> & {
  accent?: AccentName;
  mode?: ThemeMode;
  colors?: readonly [string, string, ...string[]];
};

function LinearGradient({
  accent,
  mode = "light",
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ...props
}: LinearGradientProps) {
  const tokens = getThemeTokens(mode, accent ?? DEFAULT_ACCENT);
  const tokenColors = [tokens.primary, tokens.primary2, tokens.chart3] as const;

  return (
    <ExpoLinearGradient
      colors={colors ?? tokenColors}
      start={start}
      end={end}
      {...props}
    />
  );
}

export { LinearGradient };
export type { LinearGradientProps };
