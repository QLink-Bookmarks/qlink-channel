import { type AccentName, type ThemeMode, getThemeTokens } from "@/lib/theme";
import { useDisplaySettings } from "@/stores/display-settings";

import { LinearGradient as ExpoLinearGradient } from "expo-linear-gradient";

type LinearGradientProps = Omit<React.ComponentProps<typeof ExpoLinearGradient>, "colors"> & {
  accent?: AccentName;
  mode?: ThemeMode;
  colors?: readonly [string, string, ...string[]];
};

function LinearGradient({
  accent,
  mode,
  colors,
  start = { x: 0, y: 0 },
  end = { x: 1, y: 1 },
  ...props
}: LinearGradientProps) {
  const storeAccent = useDisplaySettings((state) => state.display.accent);
  const storeMode = useDisplaySettings((state) => state.display.theme);
  const resolvedAccent = accent ?? storeAccent;
  const resolvedMode = mode ?? storeMode;
  const tokens = getThemeTokens(resolvedMode, resolvedAccent);
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
