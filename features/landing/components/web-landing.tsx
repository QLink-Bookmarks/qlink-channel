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
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { useCycledBrandColors } from "@/features/auth/hooks/use-cycled-brand-colors";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { SLIDES } from "@/features/onboarding/components/onboarding-screen";
import { getNativeThemeVars } from "@/lib/theme-vars";
import { cn } from "@/lib/utils";

import { type Href, useRouter } from "expo-router";
import { AlarmClock, Search, Share, Sparkles } from "lucide-react-native/icons";
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

// Clear pastel wash per section so scrolling reads as moving between distinct
// pages. Landing is pinned to light mode, so these fixed tints stay consistent.
const HERO_BG = "bg-[#EFE9FB]";
const SECTION_BG = ["bg-[#E9ECF3]", "bg-[#E1EDFC]", "bg-[#EEE6FB]", "bg-[#FCEFDE]", "bg-[#DFF3E7]"];
const FINAL_BG = "bg-[#FBE4EF]";
const SECTION_BLOB = ["#AEB8D4", "#9CC4F2", "#C4A9EE", "#F2C889", "#8FD9AF"];

// Ambient section backdrop: a big faded number watermark + two soft color
// blobs. Sits behind the content (overflow-hidden on the section clips it).
function SectionBackdrop({ index }: { index: number }) {
  const color = SECTION_BLOB[index % SECTION_BLOB.length];
  return (
    <View
      pointerEvents="none"
      className="absolute inset-0"
    >
      <View
        className="absolute -left-24 top-12 h-72 w-72 rounded-full"
        style={{ backgroundColor: color, opacity: 0.16 }}
      />
      <View
        className="absolute -right-24 bottom-8 h-96 w-96 rounded-full"
        style={{ backgroundColor: color, opacity: 0.12 }}
      />
      <Text className="absolute right-4 top-6 font-mono text-[150px] font-bold leading-none text-foreground/[0.045] md:text-[260px]">
        {String(index + 1).padStart(2, "0")}
      </Text>
    </View>
  );
}

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

// Landing-specific animated recreations of the onboarding visuals. The onboarding
// SLIDES render statically inside a native pager; here each internal element
// reveals in sequence as the section scrolls into view (web-only).
const faviconFor = (domain: string) => `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;

function FolderChip({
  label,
  active,
  onPress,
}: {
  label: string;
  active?: boolean;
  onPress?: () => void;
}) {
  const className = cn(
    "rounded-full border px-3.5 py-1.5",
    active ? "border-primary bg-primary" : "border-border bg-card",
    onPress && "web:transition-transform web:hover:scale-105",
  );
  const content = (
    <Text
      className={cn(
        "text-sm font-semibold",
        active ? "text-primary-foreground" : "text-muted-foreground",
      )}
    >
      {label}
    </Text>
  );
  if (!onPress) {
    return <View className={className}>{content}</View>;
  }
  return (
    <Pressable
      className={cn(className, "active:opacity-90")}
      onPress={onPress}
    >
      {content}
    </Pressable>
  );
}

function SheetChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View
      className={cn(
        "rounded-full border px-3 py-1.5",
        active ? "border-foreground bg-foreground" : "border-border bg-background",
      )}
    >
      <Text
        className={cn(
          "text-xs font-semibold",
          active ? "text-background" : "text-muted-foreground",
        )}
      >
        {label}
      </Text>
    </View>
  );
}

function TaskRow({
  text,
  done,
  reminderLabel,
  overdue,
}: {
  text: string;
  done?: boolean;
  reminderLabel?: string;
  overdue?: boolean;
}) {
  return (
    <View className="flex-row items-center gap-3">
      <Checkbox
        checked={done ?? false}
        disabled
        shape="round"
        size="sm"
        onCheckedChange={() => {}}
      />
      <Text
        className={cn("flex-1 text-sm", done && "text-muted-foreground line-through")}
        numberOfLines={1}
      >
        {text}
      </Text>
      {reminderLabel ? (
        <View
          className={cn(
            "flex-row items-center gap-1 rounded-full px-3 py-1.5",
            overdue ? "bg-destructive/10" : "bg-primary/10",
          )}
        >
          <Icon
            as={AlarmClock}
            className={cn("size-3.5", overdue ? "text-destructive" : "text-primary")}
          />
          <Text
            className={cn("text-xs font-semibold", overdue ? "text-destructive" : "text-primary")}
          >
            {reminderLabel}
          </Text>
        </View>
      ) : null}
    </View>
  );
}

const SCATTER_CARDS = [
  { pos: "left-0 top-1", rotate: "-7deg", fallback: "📁", title: "Mobile Bookmarks" },
  {
    pos: "right-0 top-16",
    rotate: "6deg",
    faviconUrl: faviconFor("brunch.co.kr"),
    fallback: "B",
    title: "일잘러 되는 법",
  },
  {
    pos: "left-0 top-32",
    rotate: "3deg",
    faviconUrl: faviconFor("youtube.com"),
    fallback: "Y",
    title: "공부할 때 듣기 좋은 플리",
  },
  {
    pos: "right-0 top-48",
    rotate: "-5deg",
    faviconUrl: faviconFor("google.com"),
    fallback: "G",
    title: "제주 3박4일 코스",
  },
  { pos: "left-3 top-64", rotate: "7deg", fallback: "🔥", title: "갖고 싶은 신발" },
];

const SCATTER_DOTS = [
  { pos: "right-8 top-1", rotate: "-10deg", fallback: "S", tint: "bg-[#1E90FF]" },
  { pos: "left-36 top-24", rotate: "8deg", fallback: "C", tint: "bg-[#F4B400]" },
  { pos: "left-2 top-52", rotate: "-6deg", fallback: "N", tint: "bg-[#03C75A]" },
  { pos: "right-10 top-72", rotate: "9deg", fallback: "W", tint: "bg-[#4B5563]" },
];

function ScatterVisual() {
  return (
    <View className="h-80">
      {SCATTER_DOTS.map((dot, index) => (
        <Reveal
          key={`dot-${index}`}
          from="scale"
          delay={index * 80}
          className={cn("absolute", dot.pos)}
        >
          <View
            className={cn(
              "size-8 items-center justify-center rounded-full shadow-qlink-sm",
              dot.tint,
            )}
            style={{ transform: [{ rotate: dot.rotate }] }}
          >
            <Text className="text-xs font-bold text-white">{dot.fallback}</Text>
          </View>
        </Reveal>
      ))}
      {SCATTER_CARDS.map((card, index) => (
        <Reveal
          key={`card-${index}`}
          from="scale"
          delay={140 + index * 120}
          className={cn("absolute w-48", card.pos)}
        >
          <View
            className="w-full flex-row items-center gap-2.5 rounded-2xl border border-border-soft bg-card px-3 py-2.5 shadow-qlink-md"
            style={{ transform: [{ rotate: card.rotate }] }}
          >
            <View className="size-7 items-center justify-center overflow-hidden rounded-lg bg-muted">
              {card.faviconUrl ? (
                <Favicon
                  url={card.faviconUrl}
                  fallback={card.fallback}
                  size="sm"
                />
              ) : (
                <Text className="text-sm">{card.fallback}</Text>
              )}
            </View>
            <Text
              className="flex-1 text-xs font-semibold text-foreground"
              numberOfLines={1}
            >
              {card.title}
            </Text>
          </View>
        </Reveal>
      ))}
    </View>
  );
}

const ORGANIZE_FOLDERS = [
  {
    key: "맛집",
    label: "🍜 맛집",
    links: [
      { domain: "map.naver.com", title: "성수 브런치 맛집 지도", tags: ["#성수", "#브런치"] },
      { domain: "instagram.com", title: "요즘 핫한 이자카야 릴스", tags: ["#이자카야", "#릴스"] },
    ],
  },
  {
    key: "플리",
    label: "🎧 플리",
    links: [
      { domain: "youtube.com", title: "공부할 때 듣기 좋은 플리", tags: ["#집중", "#lofi"] },
      { domain: "spotify.com", title: "드라이브 감성 플레이리스트", tags: ["#드라이브", "#감성"] },
    ],
  },
  {
    key: "여행",
    label: "✈️ 여행",
    links: [
      { domain: "maps.google.com", title: "제주 3박4일 여행 코스", tags: ["#제주", "#뚜벅이"] },
      { domain: "airbnb.co.kr", title: "애월 감성 숙소 모음", tags: ["#숙소", "#애월"] },
    ],
  },
];

function OrganizeVisual() {
  const [selected, setSelected] = React.useState(ORGANIZE_FOLDERS[0].key);
  const folder = ORGANIZE_FOLDERS.find((item) => item.key === selected) ?? ORGANIZE_FOLDERS[0];

  return (
    <View className="gap-3.5">
      <Reveal from="up">
        <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-qlink-sm">
          <Icon
            as={Search}
            className="size-4 text-muted-foreground"
          />
          <Text className="text-sm text-muted-foreground">저장한 링크 검색</Text>
        </View>
      </Reveal>
      <Reveal
        from="up"
        delay={110}
      >
        <View className="flex-row flex-wrap gap-2">
          <FolderChip label="전체" />
          {ORGANIZE_FOLDERS.map((item) => (
            <FolderChip
              key={item.key}
              label={item.label}
              active={item.key === selected}
              onPress={() => setSelected(item.key)}
            />
          ))}
        </View>
      </Reveal>
      {/* Keyed by folder so switching remounts the cards and replays their reveal. */}
      <View
        key={folder.key}
        className="gap-3.5"
      >
        {folder.links.map((link, index) => (
          <Reveal
            key={link.domain}
            from="up"
            delay={index === 0 ? 0 : 110}
          >
            <LinkCard
              className="shadow-qlink-md"
              domain={link.domain}
              faviconUrl={faviconFor(link.domain)}
              title={link.title}
              tags={link.tags}
            />
          </Reveal>
        ))}
      </View>
    </View>
  );
}

// Slide 3 — the browser bar appears, the share button lights up (hover/active
// highlight), then the QLink share-extension sheet rises up from below.
function ShareVisual() {
  return (
    <View className="gap-3">
      <Reveal from="up">
        <View className="w-full flex-row items-center gap-2.5 rounded-full bg-[#48484A] px-4 py-3">
          <Icon
            as={Sparkles}
            className="size-4 text-white"
          />
          <Text
            className="flex-1 text-center text-sm font-semibold text-white"
            numberOfLines={1}
          >
            news.hada.io
          </Text>
          <View className="relative size-7 items-center justify-center">
            <Reveal
              from="scale"
              delay={480}
              className="absolute inset-0 rounded-full bg-white/25"
            />
            <Icon
              as={Share}
              className="size-4 text-white"
            />
          </View>
        </View>
      </Reveal>
      <Reveal
        from="up"
        delay={700}
      >
        <View className="gap-3.5 rounded-[28px] border border-border bg-card p-5 shadow-qlink-md">
          <View className="h-1 w-10 self-center rounded-full bg-muted" />
          <View className="gap-0.5">
            <Text
              className="text-sm font-bold text-foreground"
              numberOfLines={1}
            >
              news.hada.io/topic?id=42
            </Text>
            <Text
              className="text-xs text-muted-foreground"
              numberOfLines={1}
            >
              아이디어부터 앱스토어까지 — 1인 개발 회고
            </Text>
          </View>
          <View className="gap-2">
            <Text className="text-xs font-medium text-muted-foreground">폴더</Text>
            <View className="flex-row flex-wrap gap-2">
              <SheetChip
                label="✨ AI 자동 분류"
                active
              />
              <SheetChip label="💻 개발" />
              <SheetChip label="📰 읽을거리" />
            </View>
          </View>
          <View className="gap-2">
            <Text className="text-xs font-medium text-muted-foreground">AI 모델</Text>
            <View className="flex-row gap-2">
              <SheetChip
                label="Gemini · 기본"
                active
              />
              <SheetChip label="OpenAI" />
            </View>
          </View>
          <View className="flex-row gap-3 pt-1">
            <View className="h-11 flex-1 items-center justify-center rounded-2xl border border-border bg-background">
              <Text className="text-sm font-semibold text-foreground">저장</Text>
            </View>
            <View className="relative h-11 flex-1 items-center justify-center overflow-hidden rounded-2xl">
              <LinearGradient
                accent="pink"
                style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
                pointerEvents="none"
              />
              <Text className="text-sm font-semibold text-primary-foreground">AI 요약 저장</Text>
            </View>
          </View>
        </View>
      </Reveal>
    </View>
  );
}

function TaskVisual() {
  return (
    <View className="px-2">
      <View className="gap-4 rounded-[28px] border border-border bg-card p-5 shadow-qlink-md">
        <Reveal from="up">
          <View className="flex-row items-start gap-3">
            <Favicon
              url={faviconFor("careers.lg.com")}
              fallback="L"
            />
            <View className="flex-1 gap-1">
              <Text className="text-xs text-muted-foreground">careers.lg.com</Text>
              <Text
                className="text-base font-semibold"
                numberOfLines={2}
              >
                LG CNS 2026 상반기 신입 채용
              </Text>
            </View>
          </View>
        </Reveal>
        <Reveal
          from="up"
          delay={120}
        >
          <View className="rounded-xl bg-primary/10 px-3 py-2">
            <Text className="text-sm text-foreground">
              <Text className="text-sm font-semibold text-primary">메모 · </Text>
              마감 전 포트폴리오 링크 꼭 첨부하기!
            </Text>
          </View>
        </Reveal>
        <View className="gap-3 border-t border-dashed border-border-soft pt-4">
          <Reveal
            from="up"
            delay={220}
          >
            <View className="flex-row items-center gap-2">
              <Badge variant="todo">
                <Text className="text-xs font-semibold">할 일 2/3 완료</Text>
              </Badge>
            </View>
          </Reveal>
          <Reveal
            from="up"
            delay={300}
          >
            <TaskRow
              text="자기소개서 초안 작성"
              done
            />
          </Reveal>
          <Reveal
            from="up"
            delay={380}
          >
            <TaskRow
              text="포트폴리오 첨부"
              done
            />
          </Reveal>
          <Reveal
            from="up"
            delay={460}
          >
            <TaskRow
              text="지원서 최종 제출"
              reminderLabel="06/16 09:00"
              overdue
            />
          </Reveal>
        </View>
      </View>
    </View>
  );
}

const SHARED_AVATARS = [
  { emoji: "🧑🏻‍💻", tint: "bg-[#7B61FF]", overlap: false },
  { emoji: "👩🏻", tint: "bg-[#EC4899]", overlap: true },
  { emoji: "🧑🏻‍🦱", tint: "bg-[#F59E0B]", overlap: true },
];

function SharedVisual() {
  return (
    <View className="gap-4">
      <View className="items-center gap-2">
        <View className="flex-row">
          {SHARED_AVATARS.map((avatar, index) => (
            <Reveal
              key={index}
              from="scale"
              delay={index * 110}
              className={cn(avatar.overlap && "-ml-3")}
            >
              <View
                className={cn(
                  "size-10 items-center justify-center rounded-full border-2 border-card",
                  avatar.tint,
                )}
              >
                <Text className="text-lg">{avatar.emoji}</Text>
              </View>
            </Reveal>
          ))}
          <Reveal
            from="scale"
            delay={330}
            className="-ml-3"
          >
            <View className="size-10 items-center justify-center rounded-full border-2 border-card bg-muted">
              <Text className="text-xs font-bold text-muted-foreground">+2</Text>
            </View>
          </Reveal>
        </View>
        <Reveal
          from="up"
          delay={430}
        >
          <Text className="text-xs font-medium text-muted-foreground">
            친구 5명과 함께 채우는 중
          </Text>
        </Reveal>
      </View>
      <Reveal
        from="up"
        delay={520}
      >
        <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-qlink-sm">
          <View className="size-9 items-center justify-center rounded-xl bg-muted">
            <Text className="text-lg">✈️</Text>
          </View>
          <View className="min-w-0 flex-1">
            <Text className="text-base font-bold text-foreground">제주 여행 같이 가자</Text>
            <Text className="text-xs text-muted-foreground">공유 폴더</Text>
          </View>
        </View>
      </Reveal>
      <Reveal
        from="up"
        delay={620}
      >
        <LinkCard
          className="shadow-qlink-md"
          domain="google.com"
          faviconUrl={faviconFor("google.com")}
          title="제주 맛집 지도 저장 목록"
          tags={["#맛집", "#같이가요"]}
        />
      </Reveal>
      <Reveal
        from="up"
        delay={700}
      >
        <LinkCard
          className="shadow-qlink-md"
          domain="airbnb.co.kr"
          faviconUrl={faviconFor("airbnb.co.kr")}
          title="애월 감성 숙소 모음"
          tags={["#숙소", "#애월"]}
        />
      </Reveal>
    </View>
  );
}

function LandingVisual({ slideKey }: { slideKey: string }) {
  switch (slideKey) {
    case "scatter":
      return <ScatterVisual />;
    case "organize":
      return <OrganizeVisual />;
    case "share":
      return <ShareVisual />;
    case "task":
      return <TaskVisual />;
    case "shared":
      return <SharedVisual />;
    default:
      return null;
  }
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
