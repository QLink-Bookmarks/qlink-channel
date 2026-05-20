import { Pressable, View } from "react-native";

import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function TodoEditor({
  className,
  value,
  mode,
  visibility,
  onChangeText,
  onModeChange,
  onVisibilityChange,
  onRemove,
}: {
  className?: string;
  value: string;
  mode: "none" | "time" | "recurring";
  visibility: "public" | "private";
  onChangeText?: (value: string) => void;
  onModeChange?: (value: "none" | "time" | "recurring") => void;
  onVisibilityChange?: (value: "public" | "private") => void;
  onRemove?: () => void;
}) {
  return (
    <View
      className={cn(
        "gap-3 rounded-2xl border border-border bg-surface p-4 shadow-qlink-sm",
        className,
      )}
    >
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder="Todo"
      />
      <SegmentedControl
        value={mode}
        options={[
          { label: "None", value: "none" },
          { label: "Time", value: "time" },
          { label: "Repeat", value: "recurring" },
        ]}
        onValueChange={(next) => onModeChange?.(next as "none" | "time" | "recurring")}
      />
      <SegmentedControl
        value={visibility}
        options={[
          { label: "Public", value: "public" },
          { label: "Private", value: "private" },
        ]}
        onValueChange={(next) => onVisibilityChange?.(next as "public" | "private")}
      />
      {onRemove ? (
        <Pressable onPress={onRemove}>
          <Text className="text-sm font-medium text-destructive">삭제</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export { TodoEditor };
