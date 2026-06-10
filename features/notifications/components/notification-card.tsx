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
  notification,
  onPress,
}: {
  className?: string;
  notification: NotificationListItem;
  onPress?: (notification: NotificationListItem) => void;
}) {
  const unread = !notification.readAt;

  return (
    <Pressable
      className={cn(
        "gap-2 rounded-2xl border bg-card px-4 py-3 shadow-qlink-sm active:border-primary web:hover:border-primary web:hover:bg-accent/40",
        unread ? "border-primary/30 bg-primary/5" : "border-border",
        className,
      )}
      onPress={() => onPress?.(notification)}
    >
      <View className="flex-row items-start gap-3">
        <View className="min-w-0 flex-1">
          <Text
            className="text-base font-semibold text-foreground"
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
          {unread ? <View className="size-2.5 rounded-full bg-primary" /> : null}
        </View>
      </View>
      <Text
        className="text-sm leading-5 text-muted-foreground"
        numberOfLines={2}
      >
        {notification.message}
      </Text>
    </Pressable>
  );
}

export { NotificationCard, formatNotificationTime };
