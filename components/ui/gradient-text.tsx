import * as React from "react";
import { Platform, Text as RNText, View } from "react-native";

import { LinearGradient } from "@/components/ui/linear-gradient";
import { type AccentName, type ThemeMode, getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";
import MaskedView from "@react-native-masked-view/masked-view";

import type { TextProps } from "./text";
import { Text, textVariants } from "./text";

type GradientTextProps = Omit<TextProps, "asChild" | "style"> & {
  accent?: AccentName;
  mode?: ThemeMode;
  colors?: readonly [string, string, ...string[]];
  style?: React.ComponentProps<typeof RNText>["style"];
};

function GradientText({
  className,
  variant = "default",
  accent,
  mode,
  colors,
  children,
  style,
  ...props
}: GradientTextProps) {
  const storeAccent = useDisplaySettings((state) => state.display.accent);
  const storeMode = useDisplaySettings((state) => state.display.theme);
  const resolvedAccent = accent ?? storeAccent;
  const resolvedMode = mode ?? storeMode;
  const tokens = React.useMemo(
    () => getThemeTokens(resolvedMode, resolvedAccent),
    [resolvedAccent, resolvedMode],
  );
  const gradientColors = colors ?? ([tokens.primary, tokens.primary2, tokens.chart3] as const);
  const textClassName = cn(textVariants({ variant }), className);

  if (Platform.OS === "web") {
    return (
      <Text
        {...props}
        variant={variant}
        className={cn("inline-flex self-start text-transparent", className)}
        style={[
          {
            backgroundClip: "text",
            width: "fit-content",
            backgroundImage: `linear-gradient(135deg, ${gradientColors.join(", ")})`,
            color: "transparent",
          } as never,
          style,
        ]}
      >
        {children}
      </Text>
    );
  }

  const maskElement = (
    <Text
      {...props}
      variant={variant}
      className={textClassName}
      style={style}
    >
      {children}
    </Text>
  );

  return (
    <MaskedView maskElement={maskElement}>
      <LinearGradient
        colors={gradientColors}
        className="self-start"
      >
        <View className="opacity-0">
          <Text
            {...props}
            variant={variant}
            className={textClassName}
            style={style}
          >
            {children}
          </Text>
        </View>
      </LinearGradient>
    </MaskedView>
  );
}

export { GradientText };
export type { GradientTextProps };
