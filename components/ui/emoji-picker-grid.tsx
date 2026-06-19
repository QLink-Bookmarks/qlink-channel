import * as React from "react";
import {
  ActivityIndicator,
  InteractionManager,
  type NativeScrollEvent,
  type NativeSyntheticEvent,
  Pressable,
  ScrollView,
  View,
} from "react-native";

import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type EmojiSearchEntry = {
  emoji: string;
  searchText: string;
};

// Render in chunks: mounting all ~3700 emoji cells at once freezes the JS thread
// on iOS. Start small and grow as the user scrolls toward the bottom.
const PAGE_SIZE = 150;
const LOAD_MORE_THRESHOLD = 240;

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

function EmojiPickerGridBase({
  value,
  onChange,
  maxHeight = 240,
  fixedHeight = false,
}: EmojiPickerGridProps) {
  const [entries, setEntries] = React.useState<EmojiSearchEntry[] | null>(cachedEmojiIndex);
  const [query, setQuery] = React.useState("");
  const [visibleCount, setVisibleCount] = React.useState(PAGE_SIZE);
  const deferredQuery = React.useDeferredValue(query);

  React.useEffect(() => {
    if (entries) {
      return;
    }

    let isCancelled = false;
    // Defer the heavy import + index build until after the sheet's open animation
    // settles, so opening the editor stays smooth.
    const task = InteractionManager.runAfterInteractions(() => {
      loadEmojiIndex().then((loaded) => {
        if (!isCancelled) {
          setEntries(loaded);
        }
      });
    });

    return () => {
      isCancelled = true;
      task.cancel();
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

  // Reset paging whenever the result set changes.
  React.useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [deferredQuery, entries]);

  const visibleEntries = React.useMemo(
    () => filteredEntries.slice(0, visibleCount),
    [filteredEntries, visibleCount],
  );

  const handleScroll = React.useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent;
      const distanceToBottom = contentSize.height - (contentOffset.y + layoutMeasurement.height);
      if (distanceToBottom < LOAD_MORE_THRESHOLD) {
        setVisibleCount((count) => Math.min(count + PAGE_SIZE, filteredEntries.length));
      }
    },
    [filteredEntries.length],
  );

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
            onScroll={handleScroll}
            scrollEventThrottle={64}
          >
            <View className="flex-row flex-wrap gap-1 p-2">
              {visibleEntries.map((entry) => {
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

const EmojiPickerGrid = React.memo(EmojiPickerGridBase);

export { EmojiPickerGrid };
export type { EmojiPickerGridProps };
