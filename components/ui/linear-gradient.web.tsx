import { View } from "react-native";

import { type AccentName, DEFAULT_ACCENT, type ThemeMode, getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";

type LinearGradientProps = React.ComponentProps<typeof View> & {
  accent?: AccentName;
  mode?: ThemeMode;
  colors?: readonly [string, string, ...string[]];
};

function LinearGradient({
  className,
  style,
  colors,
  accent,
  mode = "light",
  ...props
}: LinearGradientProps) {
  const tokens = getThemeTokens(mode, accent ?? DEFAULT_ACCENT);
  const tokenColors = [tokens.primary, tokens.primary2, tokens.chart3] as const;
  const resolvedColors = colors ?? tokenColors;
  const backgroundImage = `linear-gradient(135deg, ${resolvedColors.join(", ")})`;

  return (
    <View
      className={cn(className)}
      style={[{ backgroundImage } as never, style]}
      {...props}
    />
  );
}

export { LinearGradient };
export type { LinearGradientProps };
