import * as React from "react";
import { ActivityIndicator, Pressable, ScrollView, View } from "react-native";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

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

type EmojiPickerGridProps = {
  value: string | null;
  onChange: (emoji: string | null) => void;
  maxHeight?: number;
  fixedHeight?: boolean;
};

function EmojiPickerGrid({
  value,
  onChange,
  maxHeight = 240,
  fixedHeight = false,
}: EmojiPickerGridProps) {
  const [entries, setEntries] = React.useState<EmojiSearchEntry[] | null>(cachedEmojiIndex);
  const [query, setQuery] = React.useState("");
  const deferredQuery = React.useDeferredValue(query);

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
    const trimmed = deferredQuery.trim().toLowerCase();
    if (!trimmed) {
      return entries;
    }
    return entries.filter((entry) => entry.searchText.includes(trimmed));
  }, [entries, deferredQuery]);

  return (
    <View className="w-full gap-2">
      <Input
        className="h-9 rounded-xl px-3 text-sm"
        placeholder="이모지 검색 (예: 웃음, smile)"
        value={query}
        onChangeText={setQuery}
      />
      <View
        className="w-full overflow-hidden rounded-2xl border border-border bg-card"
        style={[{ minWidth: 320 }, fixedHeight ? { height: maxHeight } : undefined]}
      >
        {entries === null ? (
          <View
            className="items-center justify-center"
            style={fixedHeight ? { flex: 1 } : { height: maxHeight }}
          >
            <ActivityIndicator size="small" />
          </View>
        ) : filteredEntries.length === 0 ? (
          <View
            className="items-center justify-center"
            style={fixedHeight ? { flex: 1 } : { height: maxHeight }}
          >
            <Text className="text-sm text-muted-foreground">검색 결과가 없어요</Text>
          </View>
        ) : (
          <ScrollView
            className="scrollbar-accent"
            style={fixedHeight ? { flex: 1 } : { maxHeight }}
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

export { EmojiPickerGrid };
export type { EmojiPickerGridProps };
