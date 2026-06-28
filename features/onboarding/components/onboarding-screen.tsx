import * as React from "react";
import {
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
  useWindowDimensions,
} from "react-native";
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

import { AlarmClock } from "lucide-react-native/icons";
import { vars } from "nativewind";

function faviconFor(domain: string) {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

// Small browser/source chip used in the first slide's scattered illustration.
function SourceChip({
  className,
  label,
  fallback,
  faviconUrl,
  tint,
}: {
  className?: string;
  label: string;
  fallback: string;
  faviconUrl?: string;
  tint?: string;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center gap-2 self-start rounded-2xl border border-border-soft bg-card px-3 py-2 shadow-qlink-md",
        className,
      )}
    >
      <View
        className={cn(
          "size-6 items-center justify-center overflow-hidden rounded-lg border border-border-soft bg-muted",
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
          <Text className="text-xs font-semibold text-primary-foreground">{fallback}</Text>
        )}
      </View>
      <Text className="text-sm font-semibold text-foreground">{label}</Text>
    </View>
  );
}

function ScatterSlide() {
  return (
    <View className="gap-6">
      <View className="h-72 justify-center">
        <View
          className="absolute left-1 top-0"
          style={{ transform: [{ rotate: "-5deg" }] }}
        >
          <SourceChip
            label="Safari"
            fallback="S"
            tint="bg-[#1E90FF]"
          />
        </View>
        <View
          className="absolute right-1 top-4"
          style={{ transform: [{ rotate: "4deg" }] }}
        >
          <SourceChip
            label="Chrome"
            fallback="C"
            tint="bg-[#F4B400]"
          />
        </View>
        <View
          className="absolute -left-1 bottom-6"
          style={{ transform: [{ rotate: "3deg" }] }}
        >
          <SourceChip
            label="네이버"
            fallback="N"
            tint="bg-[#03C75A]"
          />
        </View>
        <View
          className="absolute -right-1 bottom-2"
          style={{ transform: [{ rotate: "-4deg" }] }}
        >
          <SourceChip
            label="회사 PC"
            fallback="PC"
            tint="bg-muted-foreground"
          />
        </View>
        <View className="px-6">
          <LinkCard
            className="shadow-qlink-md"
            domain="naver.com"
            faviconUrl={faviconFor("naver.com")}
            title="네이버 (NAVER) 포털"
            tags={["검색", "뉴스"]}
          />
        </View>
      </View>
    </View>
  );
}

function AiSummarySlide() {
  return (
    <View className="gap-4">
      <View className="items-center">
        <View className="flex-row items-center gap-1.5 self-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5">
          <Text className="text-sm font-semibold text-primary">✦ AI가 자동 정리했어요</Text>
        </View>
      </View>
      <LinkCard
        className="shadow-qlink-md"
        domain="wanted.co.kr"
        faviconUrl={faviconFor("wanted.co.kr")}
        title="네이버페이 프론트엔드 개발자 채용"
        summaryModelLabel="✦ 요약 모델 · gemini-3.5-flash"
        summary="한 줄 요약 · React·Next.js 경험자 상시 채용, 성능 개선 직무 중심의 프론트엔드 포지션."
        tags={["#프론트엔드", "#React", "#채용", "#Next.js"]}
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

type Slide = {
  key: string;
  title: string;
  description: string;
  render: () => React.ReactNode;
};

const SLIDES: Slide[] = [
  {
    key: "scatter",
    title: "즐겨찾기,\n여기저기 흩어져 있죠?",
    description:
      "Safari, Chrome, 네이버앱, 회사 PC, 집 PC.\n브라우저마다 따로 노는 즐겨찾기를\nQLINK 하나로 전부 한곳에.",
    render: () => <ScatterSlide />,
  },
  {
    key: "ai",
    title: "저장하면,\nAI가 알아서 정리해요",
    description: "1초 저장이면 끝.\n한 줄 요약·태그·폴더 분류까지\nAI가 자동으로 마무리합니다.",
    render: () => <AiSummarySlide />,
  },
  {
    key: "task",
    title: "할 일·일정·메모까지,\n링크에서 바로 관리해요",
    description:
      "링크마다 할 일과 메모를 더하고\n반복 알림으로 일정을 챙기면\n중요한 건 다시는 놓치지 않아요.",
    render: () => <TaskSlide />,
  },
];

function OnboardingScreen({ onDone }: { onDone: () => void }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const mode = useDisplaySettings((state) => state.display.theme);
  const scrollRef = React.useRef<ScrollView>(null);
  const [page, setPage] = React.useState(0);

  const isLast = page === SLIDES.length - 1;

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const next = Math.round(event.nativeEvent.contentOffset.x / width);
      if (next !== page) {
        setPage(next);
      }
    },
    [page, width],
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

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onScroll={handleScroll}
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
              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View
        className="gap-6 px-6"
        style={{ paddingBottom: insets.bottom + 16 }}
      >
        <View className="flex-row items-center justify-center gap-2">
          {SLIDES.map((slide, index) => (
            <View
              key={slide.key}
              className={cn(
                "h-1.5 rounded-full",
                index === page ? "w-5 bg-primary" : "w-1.5 bg-border",
              )}
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
