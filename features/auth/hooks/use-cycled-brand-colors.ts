import * as React from "react";

import { lerpHsl } from "@/lib/color-lerp";
import { type AccentName, type ThemeMode, getThemeTokens } from "@/lib/theme";

const ACCENT_CYCLE: AccentName[] = ["gray", "pink", "blue"];
const PHASE_MS = 1000;

function getStops(
  mode: ThemeMode,
  fromAccent: AccentName,
  toAccent: AccentName,
): readonly [string, string, string] {
  const from = getThemeTokens(mode, fromAccent);
  const to = getThemeTokens(mode, toAccent);
  return [from.primary, from.primary2, to.primary] as const;
}

function useCycledBrandColors(mode: ThemeMode): readonly [string, string, string] {
  const [colors, setColors] = React.useState<readonly [string, string, string]>(() =>
    getStops(mode, ACCENT_CYCLE[0], ACCENT_CYCLE[1]),
  );

  React.useEffect(() => {
    const start =
      typeof performance !== "undefined" && typeof performance.now === "function"
        ? performance.now()
        : 0;
    let raf = 0;
    const tick = (timestamp: number) => {
      const elapsed = (timestamp - start) / PHASE_MS;
      const idx = Math.floor(elapsed) % ACCENT_CYCLE.length;
      const nextIdx = (idx + 1) % ACCENT_CYCLE.length;
      const afterNextIdx = (idx + 2) % ACCENT_CYCLE.length;
      const progress = elapsed - Math.floor(elapsed);
      const from = getStops(mode, ACCENT_CYCLE[idx], ACCENT_CYCLE[nextIdx]);
      const to = getStops(mode, ACCENT_CYCLE[nextIdx], ACCENT_CYCLE[afterNextIdx]);
      setColors([
        lerpHsl(from[0], to[0], progress),
        lerpHsl(from[1], to[1], progress),
        lerpHsl(from[2], to[2], progress),
      ]);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  return colors;
}

export { useCycledBrandColors };
