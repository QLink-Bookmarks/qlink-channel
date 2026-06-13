import * as React from "react";
import { Platform, Pressable, ScrollView, View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
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
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { FolderPickerList } from "@/features/folders/components/folder-picker-list";
import { mapLinkListItem } from "@/features/home/lib/link-card-mapper";
import { deleteLink } from "@/features/links/api";
import { LinkCard } from "@/features/links/components/link-card/link-card";
import { useSetLinkFavoriteMutation } from "@/features/links/mutations";
import type { LinkListItem } from "@/features/links/types";
import { reportError } from "@/lib/error-reporting";
import { cn } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import * as Linking from "expo-linking";
import { ExternalLink, FolderOpen, Star, Trash2 } from "lucide-react-native/icons";

const DEFAULT_CONTAINER_CLASS = "flex-row flex-wrap gap-4";
const DEFAULT_ITEM_CLASS =
  "w-full md:w-[calc(50%-8px)] xl:w-[calc(33.333%-11px)] 2xl:w-[calc(25%-12px)]";

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

function BookmarkBadgeButton({
  isFavorite,
  onPress,
}: {
  isFavorite: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "size-6 items-center justify-center rounded-full border border-border shadow-qlink-sm web:hover:bg-accent",
        isFavorite ? "bg-warning/15" : "bg-card",
      )}
      onPress={onPress}
    >
      <Icon
        as={Star}
        size={12}
        className={isFavorite ? "fill-warning text-warning" : "text-muted-foreground"}
      />
    </Pressable>
  );
}

type LinkCardGridProps = {
  links: LinkListItem[];
  onCardPress: (item: LinkListItem) => void;
  activeLinkId?: number | null;
  containerClassName?: string;
  itemClassName?: string;
  todoLayout?: "row" | "stack";
};

function LinkCardGrid({
  links,
  onCardPress,
  activeLinkId,
  containerClassName,
  itemClassName,
  todoLayout = "row",
}: LinkCardGridProps) {
  const queryClient = useQueryClient();
  const [folderMoveLink, setFolderMoveLink] = React.useState<LinkListItem | null>(null);
  const [deleteTargetLink, setDeleteTargetLink] = React.useState<LinkListItem | null>(null);
  const deleteMutation = useMutation({
    mutationFn: (id: number) => deleteLink(id),
  });
  const favoriteMutation = useSetLinkFavoriteMutation();
  const isWebWide = Platform.OS === "web";

  const handleBookmark = React.useCallback(
    async (item: LinkListItem) => {
      const next = !item.isFavorite;
      try {
        await favoriteMutation.mutateAsync({
          linkId: item.id,
          payload: { isFavorite: next },
        });
        await queryClient.invalidateQueries({ queryKey: ["links", "list"] });
      } catch (error: unknown) {
        reportError(error, {
          area: "link-card-grid:toggle-favorite",
          extra: { linkId: item.id, next },
        });
      }
    },
    [favoriteMutation, queryClient],
  );

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
        area: "link-card-grid:delete",
        extra: { linkId: deleteTargetLink.id },
      });
    }
  }, [deleteMutation, deleteTargetLink, queryClient]);

  const handleFolderMoveSelect = React.useCallback(() => {
    // TODO: Persist folder move once a folder-only update endpoint is exposed.
    setFolderMoveLink(null);
  }, []);

  return (
    <>
      <View className={cn(DEFAULT_CONTAINER_CLASS, containerClassName)}>
        {links.map((item) => {
          const mapped = mapLinkListItem(item);
          const bookmarkHoverAction = isWebWide ? (
            <BookmarkBadgeButton
              isFavorite={item.isFavorite}
              onPress={() => handleBookmark(item)}
            />
          ) : item.isFavorite ? (
            <BookmarkBadgeButton
              isFavorite
              onPress={() => handleBookmark(item)}
            />
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
              className={itemClassName ?? DEFAULT_ITEM_CLASS}
            >
              <LinkCard
                active={activeLinkId === mapped.id}
                bookmarkHoverAction={bookmarkHoverAction}
                bookmarkPinned={item.isFavorite}
                domain={mapped.domain}
                faviconUrl={mapped.faviconUrl}
                remainingTodoCount={mapped.remainingTodoCount}
                statusLabel={mapped.statusLabel}
                statusVariant={mapped.statusVariant}
                summaryModelLabel={mapped.summaryModelLabel}
                tags={mapped.tags}
                title={mapped.title}
                todos={mapped.todos}
                todoLayout={todoLayout}
                trailingHoverActions={trailingHoverActions}
                onPress={() => onCardPress(item)}
              />
            </View>
          );
        })}
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
    </>
  );
}

export { LinkCardGrid };
export type { LinkCardGridProps };
