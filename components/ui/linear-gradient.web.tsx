import { View } from "react-native";

import type { AccentName, ThemeMode } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";

import { getCrossAccentStops } from "./gradient-stops";

type LinearGradientProps = React.ComponentProps<typeof View> & {
  accent?: AccentName;
  mode?: ThemeMode;
  colors?: readonly [string, string, ...string[]];
};

function LinearGradient({ className, style, colors, accent, mode, ...props }: LinearGradientProps) {
  const storeAccent = useDisplaySettings((state) => state.display.accent);
  const storeMode = useDisplaySettings((state) => state.display.theme);
  const resolvedAccent = accent ?? storeAccent;
  const resolvedMode = mode ?? storeMode;
  const tokenColors = getCrossAccentStops(resolvedMode, resolvedAccent);
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
