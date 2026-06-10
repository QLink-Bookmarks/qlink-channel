import * as React from "react";
import { RefreshControl, ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { Text } from "@/components/ui/text";

import { useNotificationsQuery } from "../queries";
import type { NotificationListItem } from "../types";
import { NotificationCard } from "./notification-card";

type NotificationInboxScreenMode = "mobile" | "wide";

function NotificationInboxScreen({ mode }: { mode: NotificationInboxScreenMode }) {
  const notificationsQuery = useNotificationsQuery({ size: 30 });
  const notifications = notificationsQuery.data?.contents ?? [];
  const unreadCount = notifications.filter((notification) => !notification.readAt).length;
  const isRefreshing = notificationsQuery.isFetching && !notificationsQuery.isLoading;

  const handleNotificationPress = React.useCallback((notification: NotificationListItem) => {
    // TODO: Navigate to the target context when notification deep links are defined.
    console.log("notification:press", {
      context: notification.context,
      contextId: notification.contextId,
    });
  }, []);

  if (mode === "wide") {
    return (
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshing}
            onRefresh={() => {
              void notificationsQuery.refetch();
            }}
          />
        }
      >
        <PageHeader
          title="알림"
          emoji="🔔"
          meta={unreadCount > 0 ? `안 읽은 알림 ${unreadCount}개` : "새 알림이 없어요"}
        />
        <View className="w-full max-w-4xl gap-3 px-6 pb-10 pt-2">
          {notificationsQuery.isLoading ? (
            <ActivityIndicator
              size="large"
              className="py-16"
            />
          ) : notifications.length === 0 ? (
            <EmptyState
              emoji="🔔"
              title="알림이 없어요"
              description="새 알림이 도착하면 이곳에 표시돼요."
            />
          ) : (
            <>
              <Text className="px-1 text-sm font-semibold text-muted-foreground">
                전체 {notifications.length}개
              </Text>
              <View className="gap-3">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onPress={handleNotificationPress}
                  />
                ))}
              </View>
            </>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={() => {
            void notificationsQuery.refetch();
          }}
        />
      }
    >
      <View className="gap-3 px-4 pb-24 pt-4">
        {notificationsQuery.isLoading ? (
          <ActivityIndicator
            size="large"
            className="py-16"
          />
        ) : notifications.length === 0 ? (
          <EmptyState
            emoji="🔔"
            title="알림이 없어요"
            description="새 알림이 도착하면 이곳에 표시돼요."
          />
        ) : (
          notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onPress={handleNotificationPress}
            />
          ))
        )}
      </View>
    </ScrollView>
  );
}

export { NotificationInboxScreen };
export type { NotificationInboxScreenMode };
