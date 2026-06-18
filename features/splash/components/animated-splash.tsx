import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

import { BrandHeader } from "@/components/layout/brand-header";
import { Text } from "@/components/ui/text";

import { useAnimatedSplash } from "../hooks/use-animated-splash";
import { SplashGlyph } from "./splash-glyph";

// Matches the native splash backgroundColor in app.config; keep in sync.
const SPLASH_BACKGROUND = "#ffffff";
// Readable slice of the grey `gradPrimary` gradient (hsl 220 9% 46% -> 64%).
const BRAND_COLORS: [string, string] = ["#6B7280", "#9BA0AB"];
const MUTED = "#9BA0AB";

function RiseIn({
  delay,
  style,
  children,
}: {
  delay: number;
  style?: StyleProp<ViewStyle>;
  children: React.ReactNode;
}) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 600, easing: Easing.out(Easing.ease) }),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ translateY: interpolate(progress.value, [0, 1], [8, 0]) }],
  }));

  return <Animated.View style={[style, animatedStyle]}>{children}</Animated.View>;
}

function LoadingDot({ delay }: { delay: number }) {
  const progress = useSharedValue(0);

  React.useEffect(() => {
    progress.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration: 600, easing: Easing.inOut(Easing.ease) }), -1, true),
    );
  }, [delay, progress]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: interpolate(progress.value, [0, 1], [0.3, 1]),
    transform: [{ scale: interpolate(progress.value, [0, 1], [0.85, 1]) }],
  }));

  return (
    <Animated.View
      style={[{ width: 6, height: 6, borderRadius: 3, backgroundColor: MUTED }, animatedStyle]}
    />
  );
}

function LoadingDots() {
  return (
    <View style={{ flexDirection: "row", gap: 7 }}>
      <LoadingDot delay={0} />
      <LoadingDot delay={180} />
      <LoadingDot delay={360} />
    </View>
  );
}

function AnimatedSplash() {
  const { visible, animatedStyle } = useAnimatedSplash();

  if (!visible) {
    return null;
  }

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: SPLASH_BACKGROUND,
        },
        animatedStyle,
      ]}
    >
      <View className="items-center">
        <View style={{ marginBottom: 24 }}>
          <SplashGlyph size={128} />
        </View>
        <RiseIn delay={1100}>
          <BrandHeader
            title="QLINK"
            size="lg"
            align="center"
            colors={BRAND_COLORS}
          />
        </RiseIn>
        <RiseIn
          delay={1350}
          style={{ marginTop: 8 }}
        >
          <Text
            className="text-sm font-medium"
            style={{ color: MUTED }}
          >
            흩어진 링크를 한곳에
          </Text>
        </RiseIn>
      </View>

      <RiseIn
        delay={1600}
        style={{ position: "absolute", bottom: 60, left: 0, right: 0 }}
      >
        <View className="items-center">
          <LoadingDots />
        </View>
      </RiseIn>
    </Animated.View>
  );
}

export { AnimatedSplash };
