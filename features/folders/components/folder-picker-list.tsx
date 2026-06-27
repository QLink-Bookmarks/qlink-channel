import { Pressable, View } from "react-native";

import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { EmptyState } from "@/components/ui/empty-state";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { useFoldersQuery } from "../queries";
import type { Folder } from "../types";

import { Sparkles } from "lucide-react-native/icons";

type FolderPickerSelection = { id: number | null; label: string; emoji?: string | null };

type FolderPickerListProps = {
  selectedFolderId: number | null;
  noneOption?: { label: string; icon?: string } | null;
  filterFolder?: (folder: Folder) => boolean;
  onSelect: (selection: FolderPickerSelection) => void;
  className?: string;
};

function getFolderLabel(folder: Folder): string {
  return folder.emoji ? `${folder.emoji} ${folder.name}` : folder.name;
}

function FolderPickerList({
  selectedFolderId,
  noneOption = { label: "없음 - ✨ AI 자동 분류", icon: "✨" },
  filterFolder,
  onSelect,
  className,
}: FolderPickerListProps) {
  const foldersQuery = useFoldersQuery({ size: 15 });
  const folders = (foldersQuery.data?.contents ?? []).filter(
    (folder) => filterFolder?.(folder) ?? true,
  );

  if (foldersQuery.isLoading) {
    return (
      <ActivityIndicator
        size="large"
        className={cn("py-10", className)}
      />
    );
  }

  if (!noneOption && folders.length === 0) {
    return (
      <EmptyState
        emoji="📁"
        title="폴더가 없어요"
        description="먼저 폴더를 만들어주세요."
      />
    );
  }

  return (
    <View className={cn("gap-2", className)}>
      {noneOption ? (
        <FolderPickerRow
          label={noneOption.label}
          icon={noneOption.icon}
          selected={selectedFolderId === null}
          onPress={() => onSelect({ id: null, label: noneOption.label })}
        />
      ) : null}
      {folders.map((folder) => (
        <FolderPickerRow
          key={folder.id}
          label={getFolderLabel(folder)}
          selected={selectedFolderId === folder.id}
          onPress={() =>
            onSelect({ id: folder.id, label: folder.name, emoji: folder.emoji ?? null })
          }
        />
      ))}
    </View>
  );
}

function FolderPickerRow({
  label,
  icon,
  selected,
  onPress,
}: {
  label: string;
  icon?: string;
  selected: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center justify-between rounded-xl border border-border bg-card px-4 py-3",
        selected && "border-primary bg-accent",
      )}
      onPress={onPress}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-2">
        {icon ? <Text>{icon}</Text> : null}
        <Text
          className={cn("font-semibold", selected && "text-accent-foreground")}
          numberOfLines={1}
        >
          {label}
        </Text>
      </View>
      {selected ? (
        <Icon
          as={Sparkles}
          size={18}
          className="text-primary"
        />
      ) : null}
    </Pressable>
  );
}

export { FolderPickerList, getFolderLabel };
export type { FolderPickerListProps, FolderPickerSelection };
