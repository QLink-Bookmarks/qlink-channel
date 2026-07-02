import * as React from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";

export type RevealFrom = "up" | "left" | "right" | "scale";

// Everything pops in with a slight scale. On mobile the slide is vertical (no
// horizontal overflow on narrow screens); the left/right slide kicks in at md.
const HIDDEN_BY: Record<RevealFrom, string> = {
  up: "translate-y-16 scale-95",
  left: "translate-y-14 scale-95 md:translate-y-0 md:-translate-x-20",
  right: "translate-y-14 scale-95 md:translate-y-0 md:translate-x-20",
  scale: "scale-90",
};

// Scroll-reveal (web-only): the first time it enters the viewport it eases in
// from `from` with a snappy expo curve. `delay` staggers siblings.
export function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
}: {
  children?: React.ReactNode;
  from?: RevealFrom;
  delay?: number;
  className?: string;
}) {
  const ref = React.useRef<View>(null);
  const [shown, setShown] = React.useState(false);

  React.useEffect(() => {
    const node = ref.current as unknown as Element | null;
    if (!node || typeof IntersectionObserver === "undefined") {
      setShown(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <View
      ref={ref}
      className={cn(
        shown
          ? "translate-x-0 translate-y-0 scale-100 opacity-100"
          : `${HIDDEN_BY[from]} opacity-0`,
        className,
      )}
      style={
        {
          transitionProperty: "opacity, transform",
          transitionDuration: "750ms",
          transitionTimingFunction: "cubic-bezier(0.34, 1.4, 0.5, 1)",
          transitionDelay: `${delay}ms`,
        } as object
      }
    >
      {children}
    </View>
  );
}
