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
  BottomSheetView,
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
  /** fitContent=false일 때 기본 스냅 포인트. 기본값 "35%" */
  defaultSize?: string | number;
  /** fitContent=false일 때 최대 스냅 포인트. 기본값 "80%" */
  maxSize?: string | number;
  /** true면 콘텐츠 높이에 맞게 동적 사이징. defaultSize/maxSize는 무시된다. */
  fitContent?: boolean;
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
  defaultSize = "35%",
  maxSize = "80%",
  fitContent = false,
  accent = DEFAULT_ACCENT,
  mode = "light",
  backgroundStyle,
  children,
  onOpenChange,
}: SheetProps) {
  const sheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = React.useMemo(
    () => (fitContent ? undefined : [defaultSize, maxSize]),
    [fitContent, defaultSize, maxSize],
  );
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

  const content = (
    <View className={cn("gap-4 p-4", className)}>
      {title ? <Text className="text-lg font-semibold">{title}</Text> : null}
      {children}
    </View>
  );

  return (
    <BottomSheet
      ref={sheetRef}
      animateOnMount={open}
      index={open ? 0 : -1}
      snapPoints={snapPoints}
      enableDynamicSizing={fitContent}
      enableContentPanningGesture={false}
      enablePanDownToClose={dismissible}
      backdropComponent={renderBackdrop}
      backgroundComponent={renderBackground}
      handleComponent={renderHandle}
      style={sheetStyle}
      onChange={handleChange}
    >
      {fitContent ? (
        <BottomSheetView>{content}</BottomSheetView>
      ) : (
        <BottomSheetScrollView
          className="scrollbar-none"
          showsVerticalScrollIndicator={false}
        >
          {content}
        </BottomSheetScrollView>
      )}
    </BottomSheet>
  );
}

export { Sheet };
export type { SheetProps };
