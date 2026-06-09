import * as React from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
  type ViewStyle,
} from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const DEFAULT_ITEM_HEIGHT = 44;
const DEFAULT_VISIBLE_COUNT = 5;
// How long after the last scroll event we treat the gesture as finished and
// commit the value. Long enough to outlast browser momentum, short enough to
// feel responsive on native.
const SCROLL_SETTLE_MS = 140;

type WheelPickerOption<T extends string | number> = {
  value: T;
  label: string;
};

type WheelPickerProps<T extends string | number> = {
  options: WheelPickerOption<T>[];
  value: T;
  onChange: (next: T) => void;
  itemHeight?: number;
  visibleCount?: number;
  className?: string;
  align?: "center" | "left" | "right";
};

function getOptionIndex<T extends string | number>(options: WheelPickerOption<T>[], value: T) {
  const index = options.findIndex((option) => option.value === value);
  return index >= 0 ? index : 0;
}

function distanceClassName(distance: number) {
  if (distance === 0) return "text-3xl font-bold text-primary";
  if (distance === 1) return "text-xl font-semibold text-muted-foreground/40";
  if (distance === 2) return "text-base text-muted-foreground/20";
  return "text-base text-transparent";
}

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function WheelPickerInner<T extends string | number>({
  options,
  value,
  onChange,
  itemHeight = DEFAULT_ITEM_HEIGHT,
  visibleCount = DEFAULT_VISIBLE_COUNT,
  className,
  align = "center",
}: WheelPickerProps<T>) {
  if (visibleCount % 2 === 0) {
    throw new Error("WheelPicker visibleCount must be odd.");
  }

  const scrollRef = React.useRef<ScrollView>(null);
  const halfVisible = Math.floor(visibleCount / 2);
  const containerHeight = itemHeight * visibleCount;
  const selectedIndex = getOptionIndex(options, value);

  // Tracks the row currently centered under the scroll viewport. Updated on
  // every scroll frame so the styling tracks the user's finger.
  const [activeIndex, setActiveIndex] = React.useState(selectedIndex);

  // Refs hold the latest values so the scroll handler closure stays stable and
  // doesn't tear down React Native's scroll listener on every render.
  const optionsRef = React.useRef(options);
  optionsRef.current = options;
  const itemHeightRef = React.useRef(itemHeight);
  itemHeightRef.current = itemHeight;
  const onChangeRef = React.useRef(onChange);
  onChangeRef.current = onChange;

  const isUserScrollingRef = React.useRef(false);
  const lastCommittedIndexRef = React.useRef(selectedIndex);
  const settleTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const hasLaidOutRef = React.useRef(false);

  const clearSettleTimer = React.useCallback(() => {
    if (settleTimerRef.current) {
      clearTimeout(settleTimerRef.current);
      settleTimerRef.current = null;
    }
  }, []);

  /**
   * Snap the wheel to `index` and notify the parent if it changed. Safe to
   * call repeatedly with the same index — it just re-aligns visually.
   */
  const commitIndex = React.useCallback((index: number, animated: boolean = true) => {
    const clamped = clamp(index, 0, optionsRef.current.length - 1);
    isUserScrollingRef.current = false;

    const targetY = clamped * itemHeightRef.current;
    scrollRef.current?.scrollTo({ y: targetY, animated });
    setActiveIndex(clamped);

    if (lastCommittedIndexRef.current !== clamped) {
      lastCommittedIndexRef.current = clamped;
      const next = optionsRef.current[clamped];
      if (next) onChangeRef.current(next.value);
    }
  }, []);

  // Re-anchor to the canonical `value` whenever it changes from outside, but
  // never fight an in-progress user gesture.
  React.useEffect(() => {
    if (isUserScrollingRef.current) return;
    if (lastCommittedIndexRef.current === selectedIndex) return;
    lastCommittedIndexRef.current = selectedIndex;
    setActiveIndex(selectedIndex);
    scrollRef.current?.scrollTo({
      y: selectedIndex * itemHeight,
      animated: hasLaidOutRef.current,
    });
  }, [itemHeight, selectedIndex]);

  React.useEffect(() => () => clearSettleTimer(), [clearSettleTimer]);

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const h = itemHeightRef.current;
      const nextIndex = clamp(Math.round(offsetY / h), 0, optionsRef.current.length - 1);

      isUserScrollingRef.current = true;
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));

      // Restart the settle timer on every scroll frame. When it finally fires
      // we know the user has stopped — snap to the nearest row and emit. This
      // is the only commit path that works reliably on web, since RN-Web's
      // `onMomentumScrollEnd` is unreliable and `snapToInterval` is native-only.
      clearSettleTimer();
      settleTimerRef.current = setTimeout(() => {
        commitIndex(nextIndex, true);
      }, SCROLL_SETTLE_MS);
    },
    [clearSettleTimer, commitIndex],
  );

  const handleLayout = React.useCallback((_event: LayoutChangeEvent) => {
    // Initial anchor: layout may not be ready when the effect first runs, so
    // re-anchor here. Skip animation on first layout to avoid a visible jump.
    const wasLaidOut = hasLaidOutRef.current;
    hasLaidOutRef.current = true;
    scrollRef.current?.scrollTo({
      y: lastCommittedIndexRef.current * itemHeightRef.current,
      animated: wasLaidOut,
    });
  }, []);

  const padding = itemHeight * halfVisible;
  const contentContainerStyle = React.useMemo<ViewStyle>(
    () => ({ paddingTop: padding, paddingBottom: padding }),
    [padding],
  );

  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <View
      className={cn("relative", className)}
      style={{ height: containerHeight }}
      onLayout={handleLayout}
    >
      <ScrollView
        ref={scrollRef}
        showsVerticalScrollIndicator={false}
        snapToInterval={itemHeight}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        contentContainerStyle={contentContainerStyle}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - activeIndex);
          return (
            <Pressable
              key={String(option.value)}
              className={cn("w-full flex-row items-center", justify)}
              style={{ height: itemHeight }}
              onPress={() => commitIndex(index, true)}
            >
              <Text
                className={cn(distanceClassName(distance))}
                allowFontScaling={false}
                numberOfLines={1}
              >
                {option.label}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const WheelPicker = React.memo(WheelPickerInner) as typeof WheelPickerInner;

export type { WheelPickerOption, WheelPickerProps };
export { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, WheelPicker };
