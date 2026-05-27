import * as React from "react";
import { Pressable, ScrollView, View } from "react-native";

import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { useFoldersQuery } from "@/features/folders/queries";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { useLinksQuery } from "@/features/links/queries";
import type { LinkOrder } from "@/features/links/types";

import { mapLinkListItem } from "../lib/link-card-mapper";
import { OrderFilter } from "./order-filter";

import { type Href, useRouter } from "expo-router";
import { Search } from "lucide-react-native";

const ALL_VALUE = "all";

function MobileHomeScreen() {
  const router = useRouter();
  const foldersQuery = useFoldersQuery({ size: 15 });
  const [selectedFolder, setSelectedFolder] = React.useState<string>(ALL_VALUE);
  const [order, setOrder] = React.useState<LinkOrder>("latest");

  const folderContents = foldersQuery.data?.contents;

  const folderOptions = React.useMemo(
    () => [
      { label: "전체", value: ALL_VALUE },
      ...(folderContents ?? []).map((folder) => ({
        label: folder.emoji ? `${folder.emoji} ${folder.name}` : folder.name,
        value: String(folder.id),
      })),
    ],
    [folderContents],
  );

  const folderId = selectedFolder === ALL_VALUE ? undefined : Number(selectedFolder) || undefined;
  const linksQuery = useLinksQuery({ folderId, order, size: 30 });
  const links = linksQuery.data?.contents ?? [];
  const isLoading = linksQuery.isLoading;
  const isEmpty = !isLoading && links.length === 0;

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <View className="gap-4 px-4 pb-24 pt-2">
        <Pressable
          className="min-h-12 flex-row items-center gap-2 rounded-3xl border border-border bg-card px-4"
          onPress={() => {
            console.log("mobile:search");
          }}
        >
          <Icon
            as={Search}
            className="size-5 text-muted-foreground"
          />
          <Text className="flex-1 text-sm text-muted-foreground">링크 · 요약 · 태그 검색…</Text>
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <SegmentedControl
            options={folderOptions}
            selectionMode="single"
            value={selectedFolder}
            variant="chipsRound"
            onValueChange={(next) => {
              if (typeof next === "string") {
                setSelectedFolder(next);
              }
            }}
          />
        </ScrollView>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          <OrderFilter
            value={order}
            onValueChange={setOrder}
          />
        </ScrollView>

        {isLoading ? (
          <ActivityIndicator
            size="large"
            className="py-16"
          />
        ) : isEmpty ? (
          <EmptyState
            emoji="📭"
            title="아직 링크가 없어요"
            description="새 링크를 추가하면 이곳에 표시돼요."
          />
        ) : (
          <View className="gap-3">
            {links.map((item) => {
              const mapped = mapLinkListItem(item);
              return (
                <LinkCard
                  key={mapped.id}
                  domain={mapped.domain}
                  faviconUrl={mapped.faviconUrl}
                  remainingTodoCount={mapped.remainingTodoCount}
                  tags={mapped.tags}
                  title={mapped.title}
                  todos={mapped.todos}
                  todoLayout="stack"
                  onPress={() => {
                    router.push(`/links/${mapped.id}` as Href);
                  }}
                />
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export { MobileHomeScreen };
