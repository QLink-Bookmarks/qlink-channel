import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type TodoHistoryEntry = {
  date: string;
  time?: string;
};

function TodoHistory({
  className,
  entries,
  open,
  onToggle,
}: {
  className?: string;
  entries: TodoHistoryEntry[];
  open?: boolean;
  onToggle?: () => void;
}) {
  return (
    <View className={cn("gap-2 rounded-2xl border border-border-soft bg-surface p-3", className)}>
      <Pressable
        className="flex-row items-center justify-between"
        onPress={onToggle}
      >
        <Text className="font-semibold">기록</Text>
        <Text className="text-sm text-muted-foreground">{open ? "숨기기" : "보기"}</Text>
      </Pressable>
      {open ? (
        <View className="gap-2">
          {entries.length ? (
            entries.map((entry) => (
              <View
                key={`${entry.date}-${entry.time}`}
                className="flex-row justify-between rounded-lg bg-surface-elevated px-3 py-2"
              >
                <Text className="text-sm">{entry.date}</Text>
                <Text className="text-sm text-muted-foreground">{entry.time}</Text>
              </View>
            ))
          ) : (
            <Text className="text-sm text-muted-foreground">기록 없음</Text>
          )}
        </View>
      ) : null}
    </View>
  );
}

export { TodoHistory };
export type { TodoHistoryEntry };
