import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { NotificationListItem } from "../types";

function formatNotificationTime(value: string) {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
}

function NotificationCard({
  className,
  disabled,
  notification,
  onPress,
}: {
  className?: string;
  disabled?: boolean;
  notification: NotificationListItem;
  onPress?: (notification: NotificationListItem) => void;
}) {
  const unread = !notification.readAt;

  return (
    <Pressable
      disabled={disabled}
      className={cn(
        "relative gap-2 overflow-visible rounded-2xl border px-4 py-3 active:border-primary",
        unread
          ? "border-primary/40 bg-card shadow-qlink-sm web:hover:border-primary web:hover:bg-accent/40"
          : "border-border/70 bg-muted/30 opacity-70 shadow-none web:hover:border-border",
        disabled && "opacity-50",
        className,
      )}
      onPress={() => onPress?.(notification)}
    >
      {unread ? (
        <View className="absolute -right-1 -top-1 size-3 rounded-full border-2 border-background bg-primary" />
      ) : null}
      <View className="flex-row items-start gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className={cn(
              "text-base font-semibold",
              unread ? "text-foreground" : "text-muted-foreground",
            )}
            numberOfLines={1}
          >
            {notification.title}
          </Text>
        </View>
        <View className="flex-row items-center gap-2">
          <Text
            className="text-xs font-medium text-muted-foreground"
            numberOfLines={1}
          >
            {formatNotificationTime(notification.firedAt)}
          </Text>
        </View>
      </View>
      <Text
        className={cn(
          "text-sm leading-5",
          unread ? "text-muted-foreground" : "text-muted-foreground/80",
        )}
        numberOfLines={2}
      >
        {notification.message}
      </Text>
    </Pressable>
  );
}

export { NotificationCard, formatNotificationTime };
