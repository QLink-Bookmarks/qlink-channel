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
import { Text } from "@/components/ui/text";
import { useCycledBrandColors } from "@/features/auth/hooks/use-cycled-brand-colors";
import { SLIDES } from "@/features/onboarding/components/onboarding-screen";
import { getNativeThemeVars } from "@/lib/theme-vars";
import { cn } from "@/lib/utils";

import {
  FINAL_BG,
  HERO_BG,
  ProgressRail,
  SECTION_BG,
  SectionBackdrop,
  StartButton,
} from "./landing-chrome";
import { LandingVisual } from "./landing-visuals";
import { Reveal } from "./reveal";

import { type Href, useRouter } from "expo-router";
import { vars } from "nativewind";

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
        <View
          className={cn(
            "min-h-screen w-full items-center justify-center gap-6 overflow-hidden px-6",
            HERO_BG,
          )}
        >
          <View
            pointerEvents="none"
            className="absolute inset-0"
          >
            <View
              className="absolute -left-20 top-24 h-80 w-80 rounded-full"
              style={{ backgroundColor: "#C9B8F0", opacity: 0.25 }}
            />
            <View
              className="absolute -right-16 bottom-24 h-96 w-96 rounded-full"
              style={{ backgroundColor: "#F1C7DE", opacity: 0.22 }}
            />
          </View>
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
              <SectionBackdrop index={index} />
              <View
                className={cn(
                  "mx-auto w-full max-w-4xl flex-col items-center gap-10 md:flex-row md:gap-16",
                  reversed && "md:flex-row-reverse",
                )}
              >
                <View className="w-full max-w-sm md:flex-1">
                  <LandingVisual slideKey={slide.key} />
                </View>
                <Reveal
                  from={reversed ? "left" : "right"}
                  delay={220}
                  className="w-full gap-4 md:flex-1"
                >
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
          className={cn(
            "min-h-screen w-full items-center justify-center gap-6 overflow-hidden px-6",
            FINAL_BG,
          )}
        >
          <View
            pointerEvents="none"
            className="absolute inset-0"
          >
            <View
              className="absolute -left-24 top-16 h-80 w-80 rounded-full"
              style={{ backgroundColor: "#F1A8CE", opacity: 0.18 }}
            />
            <View
              className="absolute -right-20 bottom-20 h-96 w-96 rounded-full"
              style={{ backgroundColor: "#E0A9EE", opacity: 0.16 }}
            />
          </View>
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
