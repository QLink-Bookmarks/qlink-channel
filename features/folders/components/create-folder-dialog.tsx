import * as React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { useCreateFolderMutation } from "../mutations";

type EmojiSearchEntry = {
  emoji: string;
  searchText: string;
};

let cachedEmojiIndex: EmojiSearchEntry[] | null = null;

async function loadEmojiIndex(): Promise<EmojiSearchEntry[]> {
  if (cachedEmojiIndex) {
    return cachedEmojiIndex;
  }

  const [koModule, enModule] = await Promise.all([
    import("emojibase-data/ko/data.json"),
    import("emojibase-data/en/data.json"),
  ]);

  type EmojibaseEntry = {
    emoji: string;
    hexcode: string;
    label?: string;
    tags?: string[];
  };

  const koEntries = (koModule.default ?? koModule) as EmojibaseEntry[];
  const enEntries = (enModule.default ?? enModule) as EmojibaseEntry[];
  const enByHex = new Map(enEntries.map((entry) => [entry.hexcode, entry]));

  cachedEmojiIndex = koEntries.map((koEntry) => {
    const enEntry = enByHex.get(koEntry.hexcode);
    const parts = [
      koEntry.label,
      ...(koEntry.tags ?? []),
      enEntry?.label,
      ...(enEntry?.tags ?? []),
    ].filter((part): part is string => Boolean(part));

    return {
      emoji: koEntry.emoji,
      searchText: parts.join(" ").toLowerCase(),
    };
  });

  return cachedEmojiIndex;
}

type CreateFolderDialogMode = "wide" | "mobile";

type CreateFolderDialogProps = {
  mode: CreateFolderDialogMode;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreated?: (folderId: number) => void;
};

function CreateFolderDialog({ mode, open, onOpenChange, onCreated }: CreateFolderDialogProps) {
  const [name, setName] = React.useState("");
  const [emoji, setEmoji] = React.useState<string | null>(null);
  const [validationError, setValidationError] = React.useState<string | undefined>();
  const mutation = useCreateFolderMutation();
  const resetMutation = mutation.reset;

  React.useEffect(() => {
    if (!open) {
      setName("");
      setEmoji(null);
      setValidationError(undefined);
      resetMutation();
    }
  }, [open, resetMutation]);

  const handleSave = React.useCallback(async () => {
    const trimmed = name.trim();
    if (!trimmed) {
      setValidationError("폴더 이름을 입력해주세요.");
      return;
    }

    try {
      const response = await mutation.mutateAsync({ name: trimmed, emoji });
      onOpenChange(false);
      onCreated?.(response.data.id);
    } catch (error) {
      console.log("folders:create:failed", error);
    }
  }, [emoji, mutation, name, onCreated, onOpenChange]);

  const body = (
    <View className="gap-4">
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">폴더 이름</Text>
        <Input
          className="h-10 rounded-xl px-4 text-base"
          autoFocus
          maxLength={100}
          placeholder="예: 디자인 레퍼런스"
          value={name}
          onChangeText={(next) => {
            setName(next);
            if (validationError) {
              setValidationError(undefined);
            }
          }}
        />
        {validationError ? (
          <Text className="text-sm font-medium text-destructive">{validationError}</Text>
        ) : null}
        {mutation.error ? (
          <Text className="text-sm font-medium text-destructive">
            폴더 생성에 실패했어요. 잠시 후 다시 시도해주세요.
          </Text>
        ) : null}
      </View>
      <View className="gap-2">
        <Text className="text-sm font-semibold text-muted-foreground">이모지</Text>
        <EmojiGrid
          value={emoji}
          onChange={setEmoji}
        />
      </View>
      <View className="flex-row justify-end gap-2">
        <Button
          className="h-10"
          variant="outline"
          onPress={() => onOpenChange(false)}
        >
          <Text>취소</Text>
        </Button>
        <Button
          className="h-10"
          disabled={mutation.isPending}
          onPress={handleSave}
        >
          <Text>저장</Text>
        </Button>
      </View>
    </View>
  );

  if (mode === "wide") {
    return (
      <Dialog
        open={open}
        onOpenChange={onOpenChange}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>새 폴더</DialogTitle>
          </DialogHeader>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <Sheet
      open={open}
      fitContent
      onOpenChange={onOpenChange}
    >
      <View className="gap-3">
        <Text className="text-lg font-semibold text-foreground">새 폴더</Text>
        {body}
      </View>
    </Sheet>
  );
}

function EmojiGrid({
  value,
  onChange,
}: {
  value: string | null;
  onChange: (emoji: string | null) => void;
}) {
  const [entries, setEntries] = React.useState<EmojiSearchEntry[] | null>(cachedEmojiIndex);
  const [query, setQuery] = React.useState("");

  React.useEffect(() => {
    if (entries) {
      return;
    }

    let isCancelled = false;
    loadEmojiIndex().then((loaded) => {
      if (!isCancelled) {
        setEntries(loaded);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [entries]);

  const filteredEntries = React.useMemo(() => {
    if (!entries) {
      return [];
    }
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) {
      return entries;
    }
    return entries.filter((entry) => entry.searchText.includes(trimmed));
  }, [entries, query]);

  return (
    <View className="gap-2">
      <Input
        className="h-9 rounded-xl px-3 text-sm"
        placeholder="이모지 검색 (예: 웃음, smile)"
        value={query}
        onChangeText={setQuery}
      />
      <View className="overflow-hidden rounded-2xl border border-border bg-card">
        {entries === null ? (
          <View
            className="items-center justify-center"
            style={{ height: 220 }}
          >
            <ActivityIndicator size="small" />
          </View>
        ) : filteredEntries.length === 0 ? (
          <View
            className="items-center justify-center"
            style={{ height: 220 }}
          >
            <Text className="text-sm text-muted-foreground">검색 결과가 없어요</Text>
          </View>
        ) : (
          <ScrollView
            className="scrollbar-accent"
            style={{ maxHeight: 220 }}
            showsVerticalScrollIndicator
          >
            <View className="flex-row flex-wrap gap-1 p-2">
              {filteredEntries.map((entry) => {
                const isSelected = entry.emoji === value;
                return (
                  <Pressable
                    key={entry.emoji}
                    className={cn(
                      "size-10 items-center justify-center rounded-xl",
                      isSelected
                        ? "border-2 border-primary bg-accent"
                        : "border border-transparent web:hover:bg-accent",
                    )}
                    onPress={() => onChange(isSelected ? null : entry.emoji)}
                  >
                    <Text className="text-xl leading-none">{entry.emoji}</Text>
                  </Pressable>
                );
              })}
            </View>
          </ScrollView>
        )}
      </View>
    </View>
  );
}

export { CreateFolderDialog };
export type { CreateFolderDialogMode, CreateFolderDialogProps };
