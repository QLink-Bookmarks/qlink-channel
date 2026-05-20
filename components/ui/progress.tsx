import { Platform, View } from "react-native";
import Animated, {
  Extrapolation,
  interpolate,
  useAnimatedStyle,
  useDerivedValue,
  withSpring,
} from "react-native-reanimated";

import { cn } from "@/lib/utils";
import * as ProgressPrimitive from "@rn-primitives/progress";

function Progress({
  className,
  value,
  indicatorClassName,
  variant = "linear",
  size = "md",
  indeterminate,
  ...props
}: React.ComponentProps<typeof ProgressPrimitive.Root> & {
  indicatorClassName?: string;
  variant?: "linear" | "circular";
  size?: "sm" | "md" | "lg";
  indeterminate?: boolean;
}) {
  const height = size === "sm" ? "h-1.5" : size === "lg" ? "h-3" : "h-2";
  return (
    <ProgressPrimitive.Root
      className={cn(
        "relative overflow-hidden rounded-full bg-primary/20",
        variant === "circular" ? "aspect-square rounded-full" : "w-full",
        variant === "circular"
          ? size === "lg"
            ? "size-12"
            : size === "sm"
              ? "size-8"
              : "size-10"
          : height,
        className,
      )}
      {...props}
    >
      <Indicator
        value={indeterminate ? 45 : value}
        className={indicatorClassName}
      />
    </ProgressPrimitive.Root>
  );
}

export { Progress };

const Indicator = Platform.select({
  web: WebIndicator,
  native: NativeIndicator,
  default: NullIndicator,
});

type IndicatorProps = {
  value: number | undefined | null;
  className?: string;
};

function WebIndicator({ value, className }: IndicatorProps) {
  if (Platform.OS !== "web") {
    return null;
  }

  return (
    <View
      className={cn("h-full w-full flex-1 bg-primary transition-all", className)}
      style={{ transform: `translateX(-${100 - (value ?? 0)}%)` }}
    >
      <ProgressPrimitive.Indicator className={cn("h-full w-full", className)} />
    </View>
  );
}

function NativeIndicator({ value, className }: IndicatorProps) {
  const progress = useDerivedValue(() => value ?? 0);

  const indicator = useAnimatedStyle(() => {
    return {
      width: withSpring(
        `${interpolate(progress.value, [0, 100], [1, 100], Extrapolation.CLAMP)}%`,
        { overshootClamping: true },
      ),
    };
  }, [value]);

  if (Platform.OS === "web") {
    return null;
  }

  return (
    <ProgressPrimitive.Indicator asChild>
      <Animated.View
        style={indicator}
        className={cn("h-full bg-foreground", className)}
      />
    </ProgressPrimitive.Indicator>
  );
}

function NullIndicator(_props: IndicatorProps) {
  return null;
}
