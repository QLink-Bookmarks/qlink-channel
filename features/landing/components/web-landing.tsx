import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { useCycledBrandColors } from "@/features/auth/hooks/use-cycled-brand-colors";
import { SLIDES } from "@/features/onboarding/components/onboarding-screen";
import { getNativeThemeVars } from "@/lib/theme-vars";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";

import { type Href, useRouter } from "expo-router";
import { vars } from "nativewind";

// Scroll-reveal wrapper (web): fades + slides its children up the first time
// they enter the viewport. Uses IntersectionObserver directly since this file
// is web-only.
function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: React.ReactNode;
  className?: string;
  delay?: number;
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
      { threshold: 0.12 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <View
      ref={ref}
      className={cn(
        "transition-all duration-700 ease-out",
        shown ? "translate-y-0 opacity-100" : "translate-y-8 opacity-0",
        className,
      )}
      style={{ transitionDelay: `${delay}ms` } as object}
    >
      {children}
    </View>
  );
}

function StartButton({ onPress, label }: { onPress: () => void; label: string }) {
  return (
    <Pressable
      className="relative h-12 items-center justify-center overflow-hidden rounded-2xl px-8 shadow-qlink-sm active:opacity-95 web:hover:opacity-90"
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

function WebLanding() {
  const router = useRouter();
  const mode = useDisplaySettings((state) => state.display.theme);
  const brandColors = useCycledBrandColors(mode);
  const goLogin = React.useCallback(() => router.push("/login" as Href), [router]);

  return (
    <ScrollView
      className="flex-1 bg-background"
      style={vars(getNativeThemeVars(mode, "gray"))}
      contentContainerStyle={{ paddingBottom: 0 }}
      showsVerticalScrollIndicator={false}
    >
      <View className="relative items-center gap-6 px-6 pb-20 pt-24 md:pb-28 md:pt-36">
        <LinearGradient
          accent="pink"
          style={{ height: 260, left: 0, opacity: 0.08, position: "absolute", right: 0, top: 0 }}
          pointerEvents="none"
        />
        <Reveal className="w-full items-center gap-5">
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
      </View>

      {SLIDES.map((slide, index) => (
        <View
          key={slide.key}
          className={cn("w-full px-6 py-14 md:py-24", index % 2 === 1 && "bg-card/40")}
        >
          <Reveal className="mx-auto w-full max-w-4xl">
            <View
              className={cn(
                "flex-col items-center gap-10 md:flex-row md:gap-16",
                index % 2 === 1 && "md:flex-row-reverse",
              )}
            >
              <View className="w-full max-w-sm md:flex-1">{slide.render()}</View>
              <View className="w-full gap-4 md:flex-1">
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
              </View>
            </View>
          </Reveal>
        </View>
      ))}

      <View className="items-center gap-6 px-6 py-24">
        <Reveal className="w-full items-center gap-5">
          <Text className="text-center text-3xl font-extrabold leading-tight text-foreground md:text-5xl">
            흩어진 북마크,{"\n"}지금 하나로 모아요
          </Text>
          <StartButton
            onPress={goLogin}
            label="웹으로 시작하기"
          />
        </Reveal>
      </View>

      <View className="items-center gap-2 border-t border-border px-6 py-10">
        <Text className="font-mono text-sm text-muted-foreground">큐링크 QLink</Text>
        <Pressable onPress={() => router.push("/privacy" as Href)}>
          <Text className="text-xs text-muted-foreground underline web:hover:text-foreground">
            개인정보처리방침
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}

export { WebLanding };
