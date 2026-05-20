import * as React from "react";
import { Platform, Pressable, View } from "react-native";
import Animated, { SlideInRight, SlideOutRight } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { Badge } from "@/components/ui/badge";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import { Portal } from "@rn-primitives/portal";

import { X } from "lucide-react-native/icons";

// View scope: 와이드뷰 전용. md >= 768px에서 사용한다.

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

function DetailPanelBody({
  className,
  title,
  url,
  summary,
  tags,
  onOpenChange,
}: {
  className?: string;
  title: string;
  url: string;
  summary?: string;
  tags: string[];
  onOpenChange?: (open: boolean) => void;
}) {
  return (
    <View
      className={cn(
        "h-full w-full max-w-[420px] gap-5 border-l border-border-soft bg-surface p-5",
        className,
      )}
    >
      <View className="flex-row items-start justify-between gap-3">
        <View className="flex-1 gap-1">
          <Text className="text-xl font-bold">{title}</Text>
          <Text className="text-xs text-muted-foreground">{url}</Text>
        </View>
        <Pressable onPress={() => onOpenChange?.(false)}>
          <Icon
            as={X}
            className="size-5 text-muted-foreground"
          />
        </Pressable>
      </View>
      {summary ? (
        <Text className="text-sm leading-relaxed text-muted-foreground">{summary}</Text>
      ) : null}
      <View className="flex-row flex-wrap gap-2">
        {tags.map((tag) => (
          <Badge
            key={tag}
            variant="tag"
          >
            <Text>{tag}</Text>
          </Badge>
        ))}
      </View>
    </View>
  );
}

function DetailPanel({
  className,
  open,
  title,
  url,
  summary,
  tags = [],
  mode = "inline",
  onOpenChange,
}: {
  className?: string;
  open: boolean;
  title: string;
  url: string;
  summary?: string;
  tags?: string[];
  mode?: "inline" | "overlay";
  onOpenChange?: (open: boolean) => void;
}) {
  if (!open) {
    return null;
  }

  if (mode === "overlay") {
    return (
      <Portal name="detail-panel-overlay">
        <FullWindowOverlay>
          <View
            className={cn(
              "bottom-0 left-0 right-0 top-0 hidden md:flex",
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
                  title={title}
                  url={url}
                  summary={summary}
                  tags={tags}
                  onOpenChange={onOpenChange}
                />
              </Animated.View>
            </View>
          </View>
        </FullWindowOverlay>
      </Portal>
    );
  }

  return (
    <Animated.View
      entering={SlideInRight.duration(220)}
      exiting={SlideOutRight.duration(180)}
    >
      <DetailPanelBody
        className={className}
        title={title}
        url={url}
        summary={summary}
        tags={tags}
        onOpenChange={onOpenChange}
      />
    </Animated.View>
  );
}

export { DetailPanel };
