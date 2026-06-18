import * as React from "react";
import {
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

import * as SplashScreen from "expo-splash-screen";

void SplashScreen.preventAutoHideAsync();

let hasPlayed = false;

// Hold long enough for the full sequence (glyph -> wordmark -> tagline -> dots,
// last rise settles ~2.2s) before fading out.
const HOLD_MS = 2400;
const FADE_MS = 500;

function useAnimatedSplash() {
  const [visible, setVisible] = React.useState(!hasPlayed);
  const opacity = useSharedValue(1);

  React.useEffect(() => {
    if (hasPlayed) {
      return;
    }
    hasPlayed = true;
    // Our overlay matches the native splash pixel-for-pixel, so hide the native
    // splash immediately to avoid a gap, then fade our overlay out once.
    void SplashScreen.hideAsync();
    opacity.value = withDelay(
      HOLD_MS,
      withTiming(0, { duration: FADE_MS }, (finished) => {
        if (finished) {
          runOnJS(setVisible)(false);
        }
      }),
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return { visible, animatedStyle };
}

export { useAnimatedSplash };
