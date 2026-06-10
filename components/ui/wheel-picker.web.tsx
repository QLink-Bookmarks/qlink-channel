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

import {
  DEFAULT_ITEM_HEIGHT,
  DEFAULT_VISIBLE_COUNT,
  type WheelPickerOption,
  type WheelPickerProps,
  clamp,
  distanceClassName,
  getOptionIndex,
} from "./wheel-picker-internals";

// How long after the last scroll event we treat the gesture as finished and
// commit the value. Long enough to outlast browser momentum, short enough to
// feel responsive.
const SCROLL_SETTLE_MS = 140;

/**
 * Web wheel picker.
 *
 * `snapToInterval` is a native-only ScrollView feature and `onMomentumScrollEnd`
 * doesn't fire reliably under react-native-web. Instead we detect scroll-end
 * with a debounced timer that restarts on every scroll event, then animate to
 * the nearest row and emit the value.
 */
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

  const [activeIndex, setActiveIndex] = React.useState(selectedIndex);

  // Refs hold the latest values so the scroll handler closure stays stable.
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

      clearSettleTimer();
      settleTimerRef.current = setTimeout(() => {
        commitIndex(nextIndex, true);
      }, SCROLL_SETTLE_MS);
    },
    [clearSettleTimer, commitIndex],
  );

  const handleLayout = React.useCallback((_event: LayoutChangeEvent) => {
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
