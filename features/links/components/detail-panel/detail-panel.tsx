import * as React from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { EmptyState } from "@/components/ui/empty-state";
import type { LinkDetail } from "@/features/links/types";
import { cn } from "@/lib/utils";

import { LinkDetailView } from "../link-detail-view";

// View scope: 와이드뷰 전용. md >= 768px에서 사용한다.

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function DetailPanelBody({
  className,
  detail,
  error,
  isLoading,
  onDeleted,
  onOpenChange,
}: {
  className?: string;
  detail?: LinkDetail;
  error?: boolean;
  isLoading?: boolean;
  onDeleted?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <View className={cn("h-full w-[clamp(420px,34vw,560px)] max-w-[560px] bg-surface", className)}>
      {isLoading ? (
        <EmptyState
          className="h-full"
          description="링크 상세 정보를 불러오는 중이다."
          title="불러오는 중"
        />
      ) : error ? (
        <EmptyState
          className="h-full"
          description="잠시 후 다시 시도해주세요."
          title="링크 상세를 불러오지 못했어요"
        />
      ) : detail ? (
        <LinkDetailView
          detail={detail}
          mode="panel"
          onClose={() => onOpenChange?.(false)}
          onDeleted={onDeleted}
        />
      ) : (
        <EmptyState
          className="h-full"
          description="선택한 링크 정보를 찾을 수 없다."
          title="상세 없음"
        />
      )}
    </View>
  );
}

function DetailPanel({
  className,
  open,
  detail,
  error,
  isLoading,
  mode = "inline",
  onDeleted,
  onOpenChange,
}: {
  className?: string;
  open: boolean;
  detail?: LinkDetail;
  error?: boolean;
  isLoading?: boolean;
  mode?: "inline" | "overlay";
  onDeleted?: () => void;
  onOpenChange?: (open: boolean) => void;
}) {
  if (!open) {
    return null;
  }

  if (mode === "overlay") {
    return (
      <FullWindowOverlay>
        <View
          className={cn(
            "bottom-0 left-0 right-0 top-0 flex",
            Platform.select({
              web: "fixed",
              default: "absolute",
            }),
          )}
        >
          <Pressable
            className="absolute bottom-0 left-0 right-0 top-0 z-backdrop bg-overlay"
            onPress={() => onOpenChange?.(false)}
          />
          <View
            className="absolute bottom-0 left-0 right-0 top-0 z-sidePanel flex-row justify-end"
            pointerEvents="box-none"
          >
            <Animated.View
              entering={SlideInRight.duration(220)}
              exiting={SlideOutRight.duration(180)}
            >
              <DetailPanelBody
                className={cn("shadow-qlink-lg", className)}
                detail={detail}
                error={error}
                isLoading={isLoading}
                onDeleted={onDeleted}
                onOpenChange={onOpenChange}
              />
            </Animated.View>
          </View>
        </View>
      </FullWindowOverlay>
    );
  }

  return (
    <Animated.View
      entering={SlideInRight.duration(220)}
      exiting={SlideOutRight.duration(180)}
    >
      <DetailPanelBody
        className={className}
        detail={detail}
        error={error}
        isLoading={isLoading}
        onDeleted={onDeleted}
        onOpenChange={onOpenChange}
      />
    </Animated.View>
  );
}

export { DetailPanel };
