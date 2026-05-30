import * as React from "react";
import { ScrollView, View } from "react-native";

import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";

import { useFoldersQuery } from "../queries";
import type { Folder } from "../types";
import { CreateFolderDialog } from "./create-folder-dialog";
import { FolderTile } from "./folder-tile";

import { type Href, useRouter } from "expo-router";

type FilterValue = "all" | "mine" | "shared";

const FILTER_OPTIONS = [
  { label: "전체", value: "all" },
  { label: "내 폴더", value: "mine" },
  { label: "공유 폴더", value: "shared" },
] as const;

function MobileFoldersScreen() {
  const router = useRouter();
  const foldersQuery = useFoldersQuery({ size: 15 });
  const [filter, setFilter] = React.useState<FilterValue>("all");
  const [isCreateOpen, setIsCreateOpen] = React.useState(false);

  const folders = foldersQuery.data?.contents ?? [];
  const myFolders = folders.filter((folder) => !folder.isShared);
  const sharedFolders = folders.filter((folder) => folder.isShared);

  const showMine = filter !== "shared";
  const showShared = filter !== "mine";

  const handleFolderPress = React.useCallback(
    (folder: Folder) => {
      router.push(`/folders/${folder.id}` as Href);
    },
    [router],
  );

  return (
    <>
      <ScrollView
        className="flex-1"
        contentInsetAdjustmentBehavior="automatic"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-5 px-4 pb-24 pt-2">
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            <View className="flex-row justify-end">
              <SegmentedControl
                options={[...FILTER_OPTIONS]}
                selectionMode="single"
                value={filter}
                variant="chipsBadge"
                onValueChange={(next) => {
                  if (typeof next === "string") {
                    setFilter(next as FilterValue);
                  }
                }}
              />
            </View>
          </ScrollView>

          {foldersQuery.isLoading ? (
            <ActivityIndicator
              size="large"
              className="py-16"
            />
          ) : (
            <View className="gap-6">
              {showMine ? (
                <FolderSection
                  title="내 폴더"
                  count={myFolders.length}
                  folders={myFolders}
                  addLabel="새 폴더"
                  onAddPress={() => setIsCreateOpen(true)}
                  onFolderPress={handleFolderPress}
                />
              ) : null}
              {showShared ? (
                <FolderSection
                  title="공유 폴더"
                  count={sharedFolders.length}
                  folders={sharedFolders}
                  addLabel="폴더 공유 시작"
                  onAddPress={() => console.log("folders:share-start:todo")}
                  onFolderPress={handleFolderPress}
                />
              ) : null}
              {!showMine && !showShared ? (
                <EmptyState
                  emoji="📁"
                  title="표시할 폴더가 없어요"
                  description="필터를 바꿔서 확인해보세요."
                />
              ) : null}
            </View>
          )}
        </View>
      </ScrollView>

      <CreateFolderDialog
        mode="mobile"
        open={isCreateOpen}
        onOpenChange={setIsCreateOpen}
      />
    </>
  );
}

type FolderSectionProps = {
  title: string;
  count: number;
  folders: Folder[];
  addLabel: string;
  onAddPress: () => void;
  onFolderPress: (folder: Folder) => void;
};

function FolderSection({
  title,
  count,
  folders,
  addLabel,
  onAddPress,
  onFolderPress,
}: FolderSectionProps) {
  return (
    <View className="gap-3">
      <View className="flex-row items-center gap-2 px-1">
        <Text className="text-sm font-semibold text-foreground">{title}</Text>
        {count > 0 ? (
          <View className="min-w-5 items-center rounded-full bg-muted px-2 py-0.5">
            <Text className="text-xs font-semibold text-muted-foreground">{count}</Text>
          </View>
        ) : null}
      </View>
      <View className="flex-row flex-wrap gap-3">
        {folders.map((folder) => (
          <FolderTile
            key={folder.id}
            className="w-[calc(50%-6px)]"
            count={folder.linkCounts}
            emoji={folder.emoji}
            name={folder.name}
            onPress={() => onFolderPress(folder)}
          />
        ))}
        <FolderTile
          add
          className="w-[calc(50%-6px)]"
          name={addLabel}
          onPress={onAddPress}
        />
      </View>
    </View>
  );
}

export { MobileFoldersScreen };
