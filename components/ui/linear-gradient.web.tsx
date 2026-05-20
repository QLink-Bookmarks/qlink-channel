import { View } from "react-native";

import { cn } from "@/lib/utils";

type LinearGradientProps = React.ComponentProps<typeof View> & {
  accent?: never;
  mode?: never;
  colors?: readonly [string, string, ...string[]];
};

function LinearGradient({
  className,
  style,
  colors,
  accent: _accent,
  mode: _mode,
  ...props
}: LinearGradientProps) {
  const backgroundImage = colors
    ? `linear-gradient(135deg, ${colors.join(", ")})`
    : "linear-gradient(135deg, hsl(var(--primary)) 0%, hsl(var(--primary-2)) 50%, hsl(var(--chart-3)) 100%)";

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
