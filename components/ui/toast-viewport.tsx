import * as React from "react";
import { View } from "react-native";
import { FadeInDown, FadeOutDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { Toast } from "@/components/ui/toast";
import { useWideView } from "@/lib/hooks/use-wide-view";
import { cn } from "@/lib/utils";
import { useChromeStore } from "@/stores/chrome";
import { useToastStore } from "@/stores/toast-store";

function ToastViewport() {
  const insets = useSafeAreaInsets();
  const isWideView = useWideView();
  const bottomTabsHeight = useChromeStore((state) => state.bottomTabsHeight);
  const items = useToastStore((state) => state.items);
  const dismissToast = useToastStore((state) => state.dismissToast);
  const pruneExpiredToasts = useToastStore((state) => state.pruneExpiredToasts);
  const [now, setNow] = React.useState(() => Date.now());

  React.useEffect(() => {
    if (!items.length) {
      return;
    }

    const timeoutIds = items
      .filter((item) => (item.durationMs ?? 4200) > 0)
      .map((item) =>
        setTimeout(
          () => {
            pruneExpiredToasts();
          },
          (item.durationMs ?? 4200) + 50,
        ),
      );

    return () => {
      timeoutIds.forEach((timeoutId) => clearTimeout(timeoutId));
    };
  }, [items, pruneExpiredToasts]);

  React.useEffect(() => {
    const hasProgressToast = items.some((item) => item.showProgress && (item.durationMs ?? 0) > 0);

    if (!hasProgressToast) {
      return;
    }

    const intervalId = setInterval(() => {
      setNow(Date.now());
    }, 50);

    return () => {
      clearInterval(intervalId);
    };
  }, [items]);

  if (!items.length) {
    return null;
  }

  const stack = [...items].sort((a, b) => b.createdAt - a.createdAt);

  return (
    <View
      className={cn(
        "absolute inset-0 z-toast",
        isWideView ? "items-end justify-end" : "items-center justify-end",
      )}
      pointerEvents="box-none"
    >
      <View
        className={cn("pointer-events-none", isWideView ? "w-full max-w-sm pr-6" : "w-full px-4")}
        style={{
          paddingBottom: isWideView
            ? Math.max(insets.bottom, 24)
            : bottomTabsHeight > 0
              ? bottomTabsHeight + 16
              : insets.bottom + 24,
        }}
      >
        <View
          className={cn("relative min-h-24", !isWideView && "mx-auto w-full max-w-sm")}
          pointerEvents="box-none"
        >
          {stack.map((item, index) => {
            const verticalOffset = index * 18;
            const scale = 1 - index * 0.04;
            const opacity = 1 - index * 0.15;
            const durationMs = item.durationMs ?? 4200;
            const progressValue =
              item.showProgress && durationMs > 0
                ? Math.max(
                    0,
                    Math.min(100, ((item.createdAt + durationMs - now) / durationMs) * 100),
                  )
                : 100;

            return (
              <NativeOnlyAnimatedView
                key={item.id}
                entering={FadeInDown.duration(220)}
                exiting={FadeOutDown.duration(180)}
                className="absolute left-0 right-0"
                pointerEvents="box-none"
                style={{
                  bottom: verticalOffset,
                  opacity,
                  transform: [{ scale }],
                  zIndex: stack.length - index,
                }}
              >
                <Toast
                  actionLabel={item.actionLabel}
                  className={cn("pointer-events-auto", !isWideView && "mx-auto w-full")}
                  description={item.description}
                  dismissible={item.dismissible}
                  progressValue={progressValue}
                  showProgress={item.showProgress}
                  title={item.title}
                  variant={item.variant}
                  onAction={item.onAction}
                  onDismiss={item.dismissible ? () => dismissToast(item.id) : undefined}
                />
              </NativeOnlyAnimatedView>
            );
          })}
        </View>
      </View>
    </View>
  );
}

export { ToastViewport };
