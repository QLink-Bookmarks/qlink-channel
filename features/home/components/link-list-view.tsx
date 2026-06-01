import * as React from "react";
import { ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { useLinksQuery } from "@/features/links/queries";
import type { LinkOrder } from "@/features/links/types";

import { mapLinkListItem } from "../lib/link-card-mapper";
import { OrderFilter } from "./order-filter";

import { type Href, useRouter } from "expo-router";

type LinkListViewProps = {
  folderId?: number;
  title: string;
  emoji?: string;
  meta?: string;
  basePath: string;
  activeLinkId?: number | null;
};

function LinkListView({ folderId, title, emoji, meta, basePath, activeLinkId }: LinkListViewProps) {
  const router = useRouter();
  const [order, setOrder] = React.useState<LinkOrder>("latest");
  const linksQuery = useLinksQuery({
    folderId,
    order,
    size: 30,
  });

  const links = linksQuery.data?.contents ?? [];
  const isEmpty = !linksQuery.isLoading && links.length === 0;
  const totalLabel = meta ?? `${links.length}개 링크`;

  return (
    <ScrollView
      className="flex-1"
      contentInsetAdjustmentBehavior="automatic"
      showsVerticalScrollIndicator={false}
    >
      <PageHeader
        title={title}
        emoji={emoji}
        meta={totalLabel}
      />
      <View className="gap-5 px-6 pb-6 pt-4 md:pt-0">
        <OrderFilter
          value={order}
          onValueChange={setOrder}
        />
        {linksQuery.isLoading ? (
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
          <View className="flex-row flex-wrap gap-4">
            {links.map((item) => {
              const mapped = mapLinkListItem(item);
              return (
                <View
                  key={mapped.id}
                  className="w-full md:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)] 2xl:w-[calc(25%-12px)]"
                >
                  <LinkCard
                    className="md:h-[21rem]"
                    active={activeLinkId === mapped.id}
                    domain={mapped.domain}
                    faviconUrl={mapped.faviconUrl}
                    remainingTodoCount={mapped.remainingTodoCount}
                    statusLabel={mapped.statusLabel}
                    statusVariant={mapped.statusVariant}
                    tags={mapped.tags}
                    title={mapped.title}
                    todos={mapped.todos}
                    onPress={() => {
                      router.replace(`${basePath}?linkId=${mapped.id}` as Href);
                    }}
                  />
                </View>
              );
            })}
          </View>
        )}
      </View>
    </ScrollView>
  );
}

export { LinkListView };
export type { LinkListViewProps };
