import * as React from "react";
import {
  type LayoutChangeEvent,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Platform,
  Pressable,
  ScrollView,
  View,
  type ViewStyle,
} from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

const DEFAULT_ITEM_HEIGHT = 44;
const DEFAULT_VISIBLE_COUNT = 5;

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

  // Drives item styling during drag. We update on every scroll frame so the
  // active row tracks the user's finger rather than snapping at the end.
  const [activeIndex, setActiveIndex] = React.useState(selectedIndex);

  // Keep the wheel anchored on the canonical `value` whenever it changes from
  // outside (parent confirms a new value, or another wheel updates the bounds).
  React.useEffect(() => {
    setActiveIndex(selectedIndex);
    scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false });
  }, [itemHeight, selectedIndex]);

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      const nextIndex = Math.max(0, Math.min(options.length - 1, Math.round(offsetY / itemHeight)));
      if (nextIndex !== activeIndex) {
        setActiveIndex(nextIndex);
      }
    },
    [activeIndex, itemHeight, options.length],
  );

  const commitIndex = React.useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(options.length - 1, index));
      const next = options[clamped];
      if (next && next.value !== value) {
        onChange(next.value);
      }
      // Always snap visually, even if value didn't change.
      scrollRef.current?.scrollTo({ y: clamped * itemHeight, animated: true });
    },
    [itemHeight, onChange, options, value],
  );

  const handleMomentumEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offsetY = event.nativeEvent.contentOffset.y;
      commitIndex(Math.round(offsetY / itemHeight));
    },
    [commitIndex, itemHeight],
  );

  // Android doesn't always fire momentum events for short flicks; settle on drag end.
  const handleDragEnd = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (Platform.OS === "android") {
        const offsetY = event.nativeEvent.contentOffset.y;
        commitIndex(Math.round(offsetY / itemHeight));
      }
    },
    [commitIndex, itemHeight],
  );

  const padding = itemHeight * halfVisible;
  const contentContainerStyle = React.useMemo<ViewStyle>(
    () => ({ paddingTop: padding, paddingBottom: padding }),
    [padding],
  );

  const justify =
    align === "left" ? "justify-start" : align === "right" ? "justify-end" : "justify-center";

  const handleLayout = React.useCallback(
    (_event: LayoutChangeEvent) => {
      // Re-anchor after layout in case the initial scroll lost its position.
      scrollRef.current?.scrollTo({ y: selectedIndex * itemHeight, animated: false });
    },
    [itemHeight, selectedIndex],
  );

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

// Cast the generic React.memo back to the original generic signature.
const WheelPicker = React.memo(WheelPickerInner) as typeof WheelPickerInner;

export type { WheelPickerOption, WheelPickerProps };
export { DEFAULT_ITEM_HEIGHT, DEFAULT_VISIBLE_COUNT, WheelPicker };
