import * as React from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  View,
  useWindowDimensions,
} from "react-native";
import Animated, {
  Extrapolation,
  type SharedValue,
  interpolate,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Favicon } from "@/components/ui/favicon";
import { Icon } from "@/components/ui/icon";
import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { getNativeThemeVars } from "@/lib/theme-vars";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";

import { AlarmClock, Search } from "lucide-react-native/icons";
import { vars } from "nativewind";

function faviconFor(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// A single scattered bookmark, tilted at a random-ish angle.
function MessyCard({
  className,
  rotate,
  faviconUrl,
  fallback,
  tint,
  title,
}: {
  className?: string;
  rotate: string;
  faviconUrl?: string;
  fallback: string;
  tint?: string;
  title: string;
}) {
  return (
    <View
      className={cn(
        "absolute w-48 flex-row items-center gap-2.5 rounded-2xl border border-border-soft bg-card px-3 py-2.5 shadow-qlink-md",
        className,
      )}
      style={{ transform: [{ rotate }] }}
    >
      <View
        className={cn(
          "size-7 items-center justify-center overflow-hidden rounded-lg bg-muted",
          tint,
        )}
      >
        {faviconUrl ? (
          <Favicon
            url={faviconUrl}
            fallback={fallback}
            size="sm"
          />
        ) : (
          <Text className="text-sm">{fallback}</Text>
        )}
      </View>
      <Text
        className="flex-1 text-xs font-semibold text-foreground"
        numberOfLines={1}
      >
        {title}
      </Text>
    </View>
  );
}

// A scattered browser icon dot, hinting at "saved all over the place".
function BrowserDot({
  className,
  rotate,
  fallback,
  tint,
}: {
  className?: string;
  rotate: string;
  fallback: string;
  tint: string;
}) {
  return (
    <View
      className={cn(
        "absolute size-8 items-center justify-center rounded-full shadow-qlink-sm",
        tint,
        className,
      )}
      style={{ transform: [{ rotate }] }}
    >
      <Text className="text-xs font-bold text-white">{fallback}</Text>
    </View>
  );
}

function ScatterSlide() {
  return (
    <View className="h-80">
      <MessyCard
        className="left-0 top-1"
        rotate="-7deg"
        fallback="📁"
        title="Mobile Bookmarks"
      />
      <MessyCard
        className="right-0 top-16"
        rotate="6deg"
        faviconUrl={faviconFor("brunch.co.kr")}
        fallback="B"
        title="일잘러 되는 법"
      />
      <MessyCard
        className="left-0 top-32"
        rotate="3deg"
        faviconUrl={faviconFor("youtube.com")}
        fallback="Y"
        title="공부할 때 듣기 좋은 플리"
      />
      <MessyCard
        className="right-0 top-48"
        rotate="-5deg"
        faviconUrl={faviconFor("google.com")}
        fallback="G"
        title="제주 3박4일 코스"
      />
      <MessyCard
        className="left-3 top-64"
        rotate="7deg"
        fallback="🔥"
        title="갖고 싶은 신발"
      />
      <BrowserDot
        className="right-8 top-1"
        rotate="-10deg"
        fallback="S"
        tint="bg-[#1E90FF]"
      />
      <BrowserDot
        className="left-36 top-24"
        rotate="8deg"
        fallback="C"
        tint="bg-[#F4B400]"
      />
      <BrowserDot
        className="left-2 top-52"
        rotate="-6deg"
        fallback="N"
        tint="bg-[#03C75A]"
      />
      <BrowserDot
        className="right-10 top-72"
        rotate="9deg"
        fallback="W"
        tint="bg-[#4B5563]"
      />
    </View>
  );
}

function ChecklistRow({
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

function TaskSlide() {
  return (
    <View className="px-2">
      <View className="gap-4 rounded-[28px] border border-border bg-card p-5 shadow-qlink-md">
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
        <View className="rounded-xl bg-primary/10 px-3 py-2">
          <Text className="text-sm text-foreground">
            <Text className="text-sm font-semibold text-primary">메모 · </Text>
            마감 전 포트폴리오 링크 꼭 첨부하기!
          </Text>
        </View>
        <View className="gap-3 border-t border-dashed border-border-soft pt-4">
          <View className="flex-row items-center gap-2">
            <Badge variant="todo">
              <Text className="text-xs font-semibold">할 일 2/3 완료</Text>
            </Badge>
          </View>
          <ChecklistRow
            text="자기소개서 초안 작성"
            done
          />
          <ChecklistRow
            text="포트폴리오 첨부"
            done
          />
          <ChecklistRow
            text="지원서 최종 제출"
            reminderLabel="06/16 09:00"
            overdue
          />
        </View>
      </View>
    </View>
  );
}

function FolderChip({ label, active }: { label: string; active?: boolean }) {
  return (
    <View
      className={cn(
        "rounded-full border px-3.5 py-1.5",
        active ? "border-primary bg-primary" : "border-border bg-card",
      )}
    >
      <Text
        className={cn(
          "text-sm font-semibold",
          active ? "text-primary-foreground" : "text-muted-foreground",
        )}
      >
        {label}
      </Text>
    </View>
  );
}

function OrganizeSlide() {
  return (
    <View className="gap-3.5">
      <View className="flex-row items-center gap-2 rounded-2xl border border-border bg-card px-4 py-3 shadow-qlink-sm">
        <Icon
          as={Search}
          className="size-4 text-muted-foreground"
        />
        <Text className="text-sm text-muted-foreground">제주</Text>
      </View>
      <View className="flex-row flex-wrap gap-2">
        <FolderChip label="전체" />
        <FolderChip label="🍜 맛집" />
        <FolderChip label="🎧 플리" />
        <FolderChip
          label="✈️ 여행"
          active
        />
      </View>
      <LinkCard
        className="shadow-qlink-md"
        domain="google.com"
        faviconUrl={faviconFor("google.com")}
        title="제주 맛집 지도 — 저장한 장소"
        tags={["#제주", "#맛집"]}
      />
      <LinkCard
        className="shadow-qlink-md"
        domain="tistory.com"
        faviconUrl={faviconFor("tistory.com")}
        title="제주 3박4일 여행 코스 총정리"
        tags={["#여행코스", "#뚜벅이"]}
      />
    </View>
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

// Recreates the QLink iOS share-extension sheet — the moment a page is shared in.
function ShareSlide() {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2 self-center rounded-full border border-border bg-card px-3.5 py-2 shadow-qlink-sm">
        <Text className="text-base">🌐</Text>
        <Text className="text-xs font-medium text-foreground">news.hada.io</Text>
        <Text className="text-xs font-semibold text-muted-foreground">공유</Text>
        <Text className="text-sm">⬆️</Text>
      </View>
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
    </View>
  );
}

function MemberAvatar({
  emoji,
  tint,
  overlap,
}: {
  emoji: string;
  tint: string;
  overlap?: boolean;
}) {
  return (
    <View
      className={cn(
        "size-10 items-center justify-center rounded-full border-2 border-card",
        tint,
        overlap && "-ml-3",
      )}
    >
      <Text className="text-lg">{emoji}</Text>
    </View>
  );
}

function SharedFolderSlide() {
  return (
    <View className="gap-4">
      <View className="items-center gap-2">
        <View className="flex-row">
          <MemberAvatar
            emoji="🧑🏻‍💻"
            tint="bg-[#7B61FF]"
          />
          <MemberAvatar
            emoji="👩🏻"
            tint="bg-[#EC4899]"
            overlap
          />
          <MemberAvatar
            emoji="🧑🏻‍🦱"
            tint="bg-[#F59E0B]"
            overlap
          />
          <View className="-ml-3 size-10 items-center justify-center rounded-full border-2 border-card bg-muted">
            <Text className="text-xs font-bold text-muted-foreground">+2</Text>
          </View>
        </View>
        <Text className="text-xs font-medium text-muted-foreground">친구 5명과 함께 채우는 중</Text>
      </View>
      <View className="flex-row items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-qlink-sm">
        <View className="size-9 items-center justify-center rounded-xl bg-muted">
          <Text className="text-lg">✈️</Text>
        </View>
        <View className="min-w-0 flex-1">
          <Text className="text-base font-bold text-foreground">제주 여행 같이 가자</Text>
          <Text className="text-xs text-muted-foreground">공유 폴더</Text>
        </View>
      </View>
      <LinkCard
        className="shadow-qlink-md"
        domain="google.com"
        faviconUrl={faviconFor("google.com")}
        title="제주 맛집 지도 저장 목록"
        tags={["#맛집", "#같이가요"]}
      />
      <LinkCard
        className="shadow-qlink-md"
        domain="airbnb.co.kr"
        faviconUrl={faviconFor("airbnb.co.kr")}
        title="애월 감성 숙소 모음"
        tags={["#숙소", "#애월"]}
      />
    </View>
  );
}

type Slide = {
  key: string;
  title: string;
  description: string;
  footnote?: string;
  render: () => React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    key: "scatter",
    title: "이게 여기 있었나?",
    description: "각종 브라우저에, 폰에, 회사 PC에…\n저장만 하고 잊어버리게 되는 북마크.",
    render: () => <ScatterSlide />,
  },
  {
    key: "organize",
    title: "흩어진 링크,\n큐링크에서 하나로",
    description: "이제 기억하는 것도, 헤매는 것도 그만.\n폴더로 모으고, 검색으로 찾고.",
    render: () => <OrganizeSlide />,
  },
  {
    key: "share",
    title: "브라우저에서\n간편하게, 스마트하게",
    description:
      "보던 페이지를 큐링크로 공유하면 바로 저장,\nAI 요약 저장으로 제목·요약·할 일까지 한 번에.",
    footnote: "AI 요약 저장 시 페이지의 서비스 정책에 따라 접근·내용 추출이 제한될 수 있어요.",
    render: () => <ShareSlide />,
  },
  {
    key: "task",
    title: "저장하고, 행동까지.",
    description: "북마크에 할 일과 알림을 더해\n저장을 넘어 행동까지.",
    render: () => <TaskSlide />,
  },
  {
    key: "shared",
    title: "같이 모으면\n더 좋으니까",
    description: "친구·팀과 폴더를 공유하고\n링크를 함께 채워가요.",
    render: () => <SharedFolderSlide />,
  },
];

// Pagination dot driven continuously by scroll position: width/opacity grow as
// its page comes into view, so it tracks the swipe instead of snapping.
function OnboardingDot({
  index,
  scrollX,
  width,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const animatedStyle = useAnimatedStyle(() => {
    const inputRange = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, inputRange, [6, 20, 6], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, inputRange, [0.35, 1, 0.35], Extrapolation.CLAMP),
    };
  });

  return (
    <Animated.View
      className="bg-primary"
      style={[{ height: 6, borderRadius: 999 }, animatedStyle]}
    />
  );
}

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const mode = useDisplaySettings((state) => state.display.theme);
  const scrollRef = React.useRef<Animated.ScrollView>(null);
  const scrollX = useSharedValue(0);
  const [page, setPage] = React.useState(0);

  const isLast = page === SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Settle `page` only when the scroll finishes, so the optimistic setPage in
  // goToPage doesn't fight Math.round mid-animation (which made the dots jump).
  const handleMomentumEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      setPage((prev) => (prev === next ? prev : next));
    },
    [width],
  );

  const goToPage = React.useCallback(
    (next: number) => {
      scrollRef.current?.scrollTo({ x: next * width, animated: true });
      setPage(next);
    },
    [width],
  );

  const handleNext = React.useCallback(() => {
    if (isLast) {
      onDone();
      return;
    }
    goToPage(page + 1);
  }, [goToPage, isLast, onDone, page]);

  return (
    <View
      className="flex-1 bg-background"
      style={vars(getNativeThemeVars(mode, "gray"))}
    >
      <View
        className="flex-row items-center justify-between px-5"
        style={{ paddingTop: insets.top + 8 }}
      >
        {page > 0 ? (
          <Pressable
            hitSlop={8}
            onPress={() => goToPage(page - 1)}
          >
            <Text className="text-sm font-medium text-muted-foreground">‹ 이전</Text>
          </Pressable>
        ) : (
          <View />
        )}
        <Pressable
          hitSlop={8}
          onPress={onDone}
        >
          <Text className="text-sm font-medium text-muted-foreground">건너뛰기</Text>
        </Pressable>
      </View>

      <Animated.ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={scrollHandler}
        onMomentumScrollEnd={handleMomentumEnd}
        className="flex-1"
      >
        {SLIDES.map((slide) => (
          <View
            key={slide.key}
            style={{ width }}
            className="flex-1 justify-center px-6"
          >
            <View className="gap-8">
              {slide.render()}
              <View className="gap-3">
                <Text className="text-center text-2xl font-bold leading-snug text-foreground">
                  {slide.title}
                </Text>
                <Text className="text-center text-sm leading-6 text-muted-foreground">
                  {slide.description}
                </Text>
                {slide.footnote ? (
                  <Text className="mt-1 px-2 text-center text-[11px] leading-4 text-muted-foreground/70">
                    {slide.footnote}
                  </Text>
                ) : null}
              </View>
            </View>
          </View>
        ))}
      </Animated.ScrollView>

      <View
        className="gap-6 px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-center gap-2">
          {SLIDES.map((slide, index) => (
            <OnboardingDot
              key={slide.key}
              index={index}
              scrollX={scrollX}
              width={width}
            />
          ))}
        </View>
        <Pressable
          className="relative h-14 w-full items-center justify-center overflow-hidden rounded-2xl shadow-qlink-sm active:opacity-95"
          onPress={handleNext}
        >
          <LinearGradient
            accent="pink"
            style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
            pointerEvents="none"
          />
          <Text className="text-base font-semibold text-primary-foreground">
            {isLast ? "시작하기" : "다음"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

export { OnboardingScreen };
