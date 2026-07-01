import * as React from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { useCycledBrandColors } from "@/features/auth/hooks/use-cycled-brand-colors";
import { SLIDES } from "@/features/onboarding/components/onboarding-screen";
import { getNativeThemeVars } from "@/lib/theme-vars";
import { cn } from "@/lib/utils";

import { type Href, useRouter } from "expo-router";
import { vars } from "nativewind";

type RevealFrom = "up" | "left" | "right" | "scale";

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
function Reveal({
  children,
  from = "up",
  delay = 0,
  className,
}: {
  children: React.ReactNode;
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

function StartButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      className="relative h-12 items-center justify-center overflow-hidden rounded-2xl px-8 shadow-qlink-md active:opacity-95 web:transition-transform web:hover:scale-105"
      onPress={onPress}
    >
      <LinearGradient
        accent="pink"
        style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        pointerEvents="none"
      />
      <Text className="text-base font-semibold text-primary-foreground">{label}</Text>
    </Pressable>
  );
}

const SECTION_EYEBROWS: Record<string, string> = {
  scatter: "문제",
  organize: "정리",
  share: "공유",
  task: "할 일",
  shared: "함께",
};

// Clear pastel wash per section so scrolling reads as moving between distinct
// pages. Landing is pinned to light mode, so these fixed tints stay consistent.
const HERO_BG = "bg-[#EFE9FB]";
const SECTION_BG = ["bg-[#E9ECF3]", "bg-[#E1EDFC]", "bg-[#EEE6FB]", "bg-[#FCEFDE]", "bg-[#DFF3E7]"];
const FINAL_BG = "bg-[#FBE4EF]";

// Vertical progress rail (desktop): a dot per page, the active one stretches.
function ProgressRail({ total, active }: { total: number; active: number }) {
  return (
    <View className="absolute right-6 top-1/2 hidden -translate-y-1/2 gap-2.5 md:flex">
      {Array.from({ length: total }).map((_, index) => (
        <View
          key={index}
          className={cn(
            "w-1 rounded-full",
            index === active ? "h-6 bg-primary" : "bg-border-strong h-1.5",
          )}
          style={
            {
              transitionProperty: "height, background-color",
              transitionDuration: "350ms",
              transitionTimingFunction: "cubic-bezier(0.16, 1, 0.3, 1)",
            } as object
          }
        />
      ))}
    </View>
  );
}

function WebLanding() {
  const router = useRouter();
  // Landing is always light — it's a marketing surface and keeps the tinted
  // section backgrounds consistent regardless of the app's theme.
  const brandColors = useCycledBrandColors("light");
  const { height } = useWindowDimensions();
  const [active, setActive] = React.useState(0);
  const goLogin = React.useCallback(() => router.push("/login" as Href), [router]);

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (height <= 0) return;
      const next = Math.round(event.nativeEvent.contentOffset.y / height);
      setActive((prev) => (prev === next ? prev : next));
    },
    [height],
  );

  return (
    <View
      className="flex-1 bg-background"
      style={vars(getNativeThemeVars("light", "gray"))}
    >
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
      >
        <View className={cn("min-h-screen w-full items-center justify-center gap-6 px-6", HERO_BG)}>
          <Reveal
            from="scale"
            className="w-full items-center gap-6"
          >
            <View className="rounded-full border border-border bg-card px-3.5 py-1.5">
              <Text className="font-mono text-xs text-muted-foreground">✦ AI 스마트 북마크</Text>
            </View>
            <BrandHeader
              size="xl"
              align="center"
              colors={brandColors}
            />
            <Text className="max-w-md text-center text-lg leading-8 text-muted-foreground md:text-2xl">
              북마크마저 간편하게, 스마트하게.
            </Text>
            <StartButton
              onPress={goLogin}
              label="웹으로 시작하기"
            />
          </Reveal>
          <View className="absolute bottom-10 items-center gap-1">
            <Text className="font-mono text-[11px] text-muted-foreground">scroll</Text>
            <Text className="text-muted-foreground">↓</Text>
          </View>
        </View>

        {SLIDES.map((slide, index) => {
          const reversed = index % 2 === 1;
          return (
            <View
              key={slide.key}
              className={cn(
                "min-h-screen w-full justify-center overflow-hidden px-6 py-16",
                SECTION_BG[index % SECTION_BG.length],
              )}
            >
              <View
                className={cn(
                  "mx-auto w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-16",
                  reversed && "md:flex-row-reverse",
                )}
              >
                <Reveal
                  from={reversed ? "right" : "left"}
                  className="w-full max-w-sm md:flex-1"
                >
                  {slide.render()}
                </Reveal>
                <Reveal
                  from={reversed ? "left" : "right"}
                  delay={220}
                  className="w-full gap-4 md:flex-1"
                >
                  <View className="flex-row items-center justify-center gap-2 md:justify-start">
                    <Text className="font-mono text-sm font-semibold text-primary">
                      {String(index + 1).padStart(2, "0")}
                    </Text>
                    <View className="bg-border-strong h-px w-6" />
                    <Text className="font-mono text-xs uppercase tracking-widest text-muted-foreground">
                      {SECTION_EYEBROWS[slide.key]}
                    </Text>
                  </View>
                  <Text className="text-center text-2xl font-bold leading-snug text-foreground md:text-left md:text-4xl">
                    {slide.title}
                  </Text>
                  <Text className="text-center text-base leading-7 text-muted-foreground md:text-left md:text-lg">
                    {slide.description}
                  </Text>
                  {slide.footnote ? (
                    <Text className="text-center text-xs leading-4 text-muted-foreground/60 md:text-left">
                      {slide.footnote}
                    </Text>
                  ) : null}
                </Reveal>
              </View>
            </View>
          );
        })}

        <View
          className={cn("min-h-screen w-full items-center justify-center gap-6 px-6", FINAL_BG)}
        >
          <Reveal
            from="up"
            className="w-full items-center gap-6"
          >
            <Text className="text-center text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
              흩어진 북마크,{"\n"}지금 하나로 모아요
            </Text>
            <StartButton
              onPress={goLogin}
              label="웹으로 시작하기"
            />
          </Reveal>
          <View className="absolute inset-x-0 bottom-0 items-center gap-2 border-t border-border bg-background px-6 py-10">
            <Text className="font-mono text-sm text-muted-foreground">큐링크 QLink</Text>
            <Pressable onPress={() => router.push("/privacy" as Href)}>
              <Text className="text-xs text-muted-foreground underline web:hover:text-foreground">
                개인정보처리방침
              </Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>

      <ProgressRail
        total={SLIDES.length + 2}
        active={active}
      />
    </View>
  );
}

export { WebLanding };
