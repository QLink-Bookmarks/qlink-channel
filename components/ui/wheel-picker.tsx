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

/**
 * Native wheel picker.
 *
 * Relies on `snapToInterval` for the snap-while-decelerating effect and
 * `onMomentumScrollEnd` / `onScrollEndDrag` to commit the new value. These
 * are dependable on iOS and Android, so no debounced scroll-end detector is
 * needed (see wheel-picker.web.tsx for the web variant).
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

  const lastCommittedIndexRef = React.useRef(selectedIndex);
  const isUserScrollingRef = React.useRef(false);
  const hasLaidOutRef = React.useRef(false);

  const commitIndex = React.useCallback(
    (index: number) => {
      const clamped = clamp(index, 0, options.length - 1);
      isUserScrollingRef.current = false;
      setActiveIndex(clamped);
      if (lastCommittedIndexRef.current !== clamped) {
        lastCommittedIndexRef.current = clamped;
        const next = options[clamped];
        if (next) onChange(next.value);
      }
    },
    [onChange, options],
  );

  // Re-anchor to the canonical `value` when it changes externally, but never
  // fight an in-progress user gesture.
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

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const nextIndex = clamp(Math.round(offsetY / itemHeight), 0, options.length - 1);
      isUserScrollingRef.current = true;
      setActiveIndex((prev) => (prev === nextIndex ? prev : nextIndex));
    },
    [itemHeight, options.length],
  );

  const handleMomentumEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      commitIndex(Math.round(offsetY / itemHeight));
    },
    [commitIndex, itemHeight],
  );

  // Short flicks on Android may not trigger momentum events; commit on drag
  // end as a safety net. commitIndex is idempotent so double-firing is fine.
  const handleDragEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      commitIndex(Math.round(offsetY / itemHeight));
    },
    [commitIndex, itemHeight],
  );

  const handleLayout = React.useCallback(
    (_event: LayoutChangeEvent) => {
      const wasLaidOut = hasLaidOutRef.current;
      hasLaidOutRef.current = true;
      scrollRef.current?.scrollTo({
        y: lastCommittedIndexRef.current * itemHeight,
        animated: wasLaidOut,
      });
    },
    [itemHeight],
  );

  const padding = itemHeight * halfVisible;
  const contentContainerStyle = React.useMemo<ViewStyle>(
    () => ({ paddingTop: padding, paddingBottom: padding }),
    [padding],
  );

  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  return (
    <View
      className={cn("relative w-full", className)}
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
        onMomentumScrollEnd={handleMomentumEnd}
        onScrollEndDrag={handleDragEnd}
        contentContainerStyle={contentContainerStyle}
      >
        {options.map((option, index) => {
          const distance = Math.abs(index - activeIndex);
          return (
            <Pressable
              key={String(option.value)}
              className={cn("w-full flex-row items-center", justify)}
              style={{ height: itemHeight }}
              onPress={() => commitIndex(index)}
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
