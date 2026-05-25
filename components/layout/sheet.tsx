import * as React from "react";
import { type StyleProp, View, type ViewStyle } from "react-native";
import Animated from "react-native-reanimated";

import { Text } from "@/components/ui/text";
import { type AccentName, DEFAULT_ACCENT, type ThemeMode, getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import BottomSheet, {
  BottomSheetBackdrop,
  type BottomSheetBackdropProps,
  type BottomSheetBackgroundProps,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

// View scope: 모바일 전용. md >= 768px에서는 사용하지 않는다.

type SheetBackgroundProps = BottomSheetBackgroundProps & {
  accent: AccentName;
  mode: ThemeMode;
  backgroundStyle?: StyleProp<ViewStyle>;
};

function SheetBackground({ style, accent, mode, backgroundStyle }: SheetBackgroundProps) {
  const tokens = getThemeTokens(mode, accent);
  const containerStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => [
      style,
      {
        backgroundColor: tokens.background,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        borderTopWidth: 1,
        borderColor: tokens.border,
      },
      backgroundStyle,
    ],
    [backgroundStyle, style, tokens],
  );

  return (
    <Animated.View
      pointerEvents="none"
      style={containerStyle}
    />
  );
}

type SheetProps = {
  className?: string;
  open: boolean;
  title?: string;
  dismissible?: boolean;
  snapPoints?: (string | number)[];
  initialSnapIndex?: number;
  accent?: AccentName;
  mode?: ThemeMode;
  backgroundStyle?: StyleProp<ViewStyle>;
  children?: React.ReactNode;
  onOpenChange?: (open: boolean) => void;
};

function Sheet({
  className,
  open,
  title,
  dismissible = true,
  snapPoints = ["50%"],
  initialSnapIndex = 0,
  accent = DEFAULT_ACCENT,
  mode = "light",
  backgroundStyle,
  children,
  onOpenChange,
}: SheetProps) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const memoizedSnapPoints = React.useMemo(() => snapPoints, [snapPoints]);
  const sheetTokens = React.useMemo(() => getThemeTokens(mode, accent), [accent, mode]);
  const backdropStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => ({
      backgroundColor:
        mode === "dark"
          ? `rgba(${sheetTokens.glowRgb}, 0.14)`
          : `rgba(${sheetTokens.glowRgb}, 0.24)`,
    }),
    [mode, sheetTokens],
  );
  const sheetStyle = React.useMemo<StyleProp<ViewStyle>>(
    () => ({
      shadowColor: `rgb(${sheetTokens.glowRgb})`,
      shadowOffset: { width: 0, height: 12 },
      shadowOpacity: 0.25,
      shadowRadius: 32,
      elevation: 12,
    }),
    [sheetTokens],
  );

  const handleChange = React.useCallback(
    (index: number) => {
      if (index < 0) {
        onOpenChange?.(false);
      }
    },
    [onOpenChange],
  );
  const handleBackdropPress = React.useCallback(() => {
    onOpenChange?.(false);
    sheetRef.current?.close();
  }, [onOpenChange]);

  const renderBackdrop = React.useCallback(
    (props: BottomSheetBackdropProps) => (
      <BottomSheetBackdrop
        {...props}
        onPress={dismissible ? handleBackdropPress : undefined}
        appearsOnIndex={0}
        disappearsOnIndex={-1}
        opacity={1}
        style={backdropStyle}
        pressBehavior={dismissible ? "close" : "none"}
      />
    ),
    [backdropStyle, dismissible, handleBackdropPress],
  );
  const renderBackground = React.useCallback(
    (props: BottomSheetBackgroundProps) => (
      <SheetBackground
        {...props}
        accent={accent}
        mode={mode}
        backgroundStyle={backgroundStyle}
      />
    ),
    [accent, backgroundStyle, mode],
  );

  const renderHandle = React.useCallback(
    () => (
      <View className="items-center bg-transparent py-3">
        <View className="h-1.5 w-10 rounded-full bg-border" />
      </View>
    ),
    [],
  );

  return (
    <BottomSheet
      ref={sheetRef}
      animateOnMount={open}
      index={open ? initialSnapIndex : -1}
      snapPoints={memoizedSnapPoints}
      enablePanDownToClose={dismissible}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      handleComponent={renderHandle}
      style={sheetStyle}
      onChange={handleChange}
    >
      <BottomSheetScrollView
        className="scrollbar-none"
        showsVerticalScrollIndicator={false}
      >
        <View className={cn("gap-4 p-4", className)}>
          {title ? <Text className="text-lg font-semibold">{title}</Text> : null}
          {children}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
}

export { Sheet };
export type { SheetProps };
