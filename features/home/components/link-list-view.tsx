import * as React from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";

import { PageHeader } from "@/components/layout/page-header";
import { Sheet } from "@/components/layout/sheet";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { FolderPickerList } from "@/features/folders/components/folder-picker-list";
import { deleteLink } from "@/features/links/api";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { useLinksQuery } from "@/features/links/queries";
import type { LinkListItem, LinkOrder } from "@/features/links/types";
import { reportError } from "@/lib/error-reporting";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { mapLinkListItem } from "../lib/link-card-mapper";
import { OrderFilter } from "./order-filter";

import * as Linking from "expo-linking";
import { type Href, useRouter } from "expo-router";
import { ExternalLink, FolderOpen, Star, Trash2 } from "lucide-react-native/icons";

type LinkListViewProps = {
  folderId?: number;
  title: string;
  emoji?: string;
  meta?: string;
  basePath: string;
  activeLinkId?: number | null;
};

function openInNewTab(url: string) {
  if (process.env.EXPO_OS === "web") {
    globalThis.open?.(url, "_blank", "noopener,noreferrer");
    return;
  }
  Linking.openURL(url);
}

function HoverActionButton({
  icon,
  onPress,
  tone = "default",
}: {
  icon: React.ComponentProps<typeof Icon>["as"];
  onPress: () => void;
  tone?: "default" | "destructive";
}) {
  return (
    <Pressable
      className="size-7 items-center justify-center rounded-lg web:hover:bg-accent"
      onPress={onPress}
    >
      <Icon
        as={icon}
        size={13}
        className={tone === "destructive" ? "text-destructive" : "text-foreground"}
      />
    </Pressable>
  );
}

function BookmarkBadgeButton({ onPress }: { onPress: () => void }) {
  return (
    <Pressable
      className="size-6 items-center justify-center rounded-full border border-border bg-card shadow-qlink-sm web:hover:bg-accent"
      onPress={onPress}
    >
      <Icon
        as={Star}
        size={12}
        className="text-warning"
      />
    </Pressable>
  );
}

function LinkListView({ folderId, title, emoji, meta, basePath, activeLinkId }: LinkListViewProps) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [order, setOrder] = React.useState<LinkOrder>("latest");
  const [folderMoveLink, setFolderMoveLink] = React.useState<LinkListItem | null>(null);
  const [deleteTargetLink, setDeleteTargetLink] = React.useState<LinkListItem | null>(null);
  const linksQuery = useLinksQuery({
    folderId,
    order,
    size: 30,
  });
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLink(id),
  });

  const links = linksQuery.data?.contents ?? [];
  const isEmpty = !linksQuery.isLoading && links.length === 0;
  const totalLabel = meta ?? `${links.length}개 링크`;

  const handleBookmark = React.useCallback((item: LinkListItem) => {
    // TODO: Wire bookmark/pin once the API exposes a shortcut flag.
    console.log("link-card:bookmark:todo", { id: item.id });
  }, []);

  const handleConfirmDelete = React.useCallback(async () => {
    if (!deleteTargetLink) {
      return;
    }
    try {
      await deleteMutation.mutateAsync(deleteTargetLink.id);
      setDeleteTargetLink(null);
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["links", "list"] }),
        queryClient.invalidateQueries({ queryKey: ["folders"] }),
      ]);
    } catch (error: unknown) {
      reportError(error, {
        area: "link-list-view:delete",
        extra: { linkId: deleteTargetLink.id },
      });
    }
  }, [deleteMutation, deleteTargetLink, queryClient]);

  const handleFolderMoveSelect = React.useCallback(() => {
    // TODO: Persist folder move once a folder-only update endpoint is exposed.
    setFolderMoveLink(null);
  }, []);

  const isWebWide = Platform.OS === "web";

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
              const bookmarkHoverAction = isWebWide ? (
                <BookmarkBadgeButton onPress={() => handleBookmark(item)} />
              ) : undefined;
              const trailingHoverActions = isWebWide ? (
                <>
                  <HoverActionButton
                    icon={ExternalLink}
                    onPress={() => openInNewTab(item.url)}
                  />
                  <HoverActionButton
                    icon={FolderOpen}
                    onPress={() => setFolderMoveLink(item)}
                  />
                  <HoverActionButton
                    icon={Trash2}
                    tone="destructive"
                    onPress={() => setDeleteTargetLink(item)}
                  />
                </>
              ) : undefined;
              return (
                <View
                  key={mapped.id}
                  className="w-full md:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)] 2xl:w-[calc(25%-12px)]"
                >
                  <LinkCard
                    active={activeLinkId === mapped.id}
                    bookmarkHoverAction={bookmarkHoverAction}
                    domain={mapped.domain}
                    faviconUrl={mapped.faviconUrl}
                    remainingTodoCount={mapped.remainingTodoCount}
                    statusLabel={mapped.statusLabel}
                    statusVariant={mapped.statusVariant}
                    summaryModelLabel={mapped.summaryModelLabel}
                    tags={mapped.tags}
                    title={mapped.title}
                    todos={mapped.todos}
                    trailingHoverActions={trailingHoverActions}
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

      {isWebWide ? (
        <Dialog
          open={Boolean(folderMoveLink)}
          onOpenChange={(open) => {
            if (!open) setFolderMoveLink(null);
          }}
        >
          <DialogContent className="max-h-[80vh] min-h-[24rem] min-w-[24rem] max-w-md">
            <DialogHeader>
              <DialogTitle>폴더 이동</DialogTitle>
              <DialogDescription>이동할 폴더를 선택해주세요.</DialogDescription>
            </DialogHeader>
            <ScrollView
              className="flex-1"
              contentInsetAdjustmentBehavior="automatic"
              showsVerticalScrollIndicator={false}
            >
              <FolderPickerList
                noneOption={null}
                selectedFolderId={folderMoveLink?.folderId ?? null}
                onSelect={handleFolderMoveSelect}
              />
            </ScrollView>
          </DialogContent>
        </Dialog>
      ) : (
        <Sheet
          open={Boolean(folderMoveLink)}
          fitContent
          onOpenChange={(open) => {
            if (!open) setFolderMoveLink(null);
          }}
        >
          <View className="gap-3">
            <Text className="text-lg font-semibold text-foreground">폴더 이동</Text>
            <FolderPickerList
              noneOption={null}
              selectedFolderId={folderMoveLink?.folderId ?? null}
              onSelect={handleFolderMoveSelect}
            />
            <Button
              className="h-10 self-stretch"
              variant="outline"
              onPress={() => setFolderMoveLink(null)}
            >
              <Text>닫기</Text>
            </Button>
          </View>
        </Sheet>
      )}

      <AlertDialog
        open={Boolean(deleteTargetLink)}
        onOpenChange={(open) => {
          if (!open) setDeleteTargetLink(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>링크를 삭제할까요?</AlertDialogTitle>
            <AlertDialogDescription>
              삭제하면 이 링크를 다시 되돌릴 수 없습니다.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-row justify-center">
            <AlertDialogCancel className="native:px-3 flex-1 justify-center sm:flex-none">
              <Text className="text-center">취소</Text>
            </AlertDialogCancel>
            <AlertDialogAction
              className="native:px-3 flex-1 justify-center sm:flex-none"
              variant="destructive"
              onPress={handleConfirmDelete}
            >
              <Text className="text-center">
                {deleteMutation.isPending ? "삭제 중..." : "삭제"}
              </Text>
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </ScrollView>
  );
}

export { LinkListView };
export type { LinkListViewProps };
