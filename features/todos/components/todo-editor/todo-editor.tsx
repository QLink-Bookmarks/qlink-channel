import { Pressable, View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { Input } from "@/components/ui/input";
import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { CalendarDays, Clock3, X } from "lucide-react-native/icons";

type TodoEditorMode = "none" | "time" | "recurring";
type TodoEditorVisibility = "public" | "private";

const weekdayOptions = [
  { label: "월", value: "mon" },
  { label: "화", value: "tue" },
  { label: "수", value: "wed" },
  { label: "목", value: "thu" },
  { label: "금", value: "fri" },
  { label: "토", value: "sat" },
  { label: "일", value: "sun" },
] as const;

function TodoEditor({
  className,
  value,
  index = 1,
  mode,
  onChangeText,
  onModeChange,
  onRemove,
  onTimePress,
  onDatePress,
}: {
  className?: string;
  index?: number;
  value: string;
  mode: TodoEditorMode;
  visibility?: TodoEditorVisibility;
  onChangeText?: (value: string) => void;
  onModeChange?: (value: TodoEditorMode) => void;
  onVisibilityChange?: (value: TodoEditorVisibility) => void;
  onRemove?: () => void;
  onTimePress?: () => void;
  onDatePress?: () => void;
}) {
  return (
    <View
      className={cn(
        "gap-3 rounded-2xl border border-border bg-surface p-4 shadow-qlink-sm",
        className,
      )}
    >
      <View className="flex-row items-center gap-3">
        <View className="size-9 items-center justify-center rounded-lg bg-muted-foreground">
          <Text className="text-sm font-semibold text-background">{index}</Text>
        </View>
        <View className="relative flex-1">
          <Input
            className="h-14 pr-12 text-base"
            value={value}
            onChangeText={onChangeText}
            placeholder="할 일 제목"
          />
          {onRemove ? (
            <IconButton
              className="absolute right-1 top-1.5"
              icon={X}
              size="sm"
              onPress={onRemove}
            />
          ) : null}
        </View>
      </View>
      <SegmentedControl
        value={mode}
        block
        className="border-transparent bg-transparent p-0"
        options={[
          { label: "시간 없음", value: "none" },
          { label: "시간 선택", value: "time" },
          { label: "반복 알림", value: "recurring" },
        ]}
        onValueChange={(next) => onModeChange?.(next as TodoEditorMode)}
      />

      {mode === "recurring" ? (
        <View className="gap-3">
          <Text className="text-sm font-semibold text-muted-foreground">
            반복 요일 (기본 매일, 해제 시 그 요일 제외)
          </Text>
          <View className="flex-row gap-1">
            {weekdayOptions.map((weekday) => (
              <Pressable
                key={weekday.value}
                className="min-h-12 flex-1 items-center justify-center rounded-lg bg-muted-foreground"
              >
                <Text className="font-semibold text-background">{weekday.label}</Text>
              </Pressable>
            ))}
          </View>
        </View>
      ) : null}

      {mode !== "none" ? (
        <View className="flex-row gap-3">
          <Pressable
            className="h-14 flex-1 flex-row items-center justify-between rounded-md border border-input bg-background px-4 shadow-sm shadow-black/5"
            onPress={onTimePress}
          >
            <Text className="text-base text-foreground">오전 09:00</Text>
            <Clock3 size={20} />
          </Pressable>
          <Pressable
            className="h-14 flex-1 flex-row items-center justify-between rounded-md border border-input bg-background px-4 shadow-sm shadow-black/5"
            onPress={onDatePress}
          >
            <Text className="text-base text-foreground">년-월-일</Text>
            <CalendarDays size={18} />
          </Pressable>
        </View>
      ) : null}

      {mode === "recurring" ? (
        <View className="rounded-md bg-muted px-4 py-3">
          <Text className="text-sm font-semibold text-muted-foreground">📌 매일 09:00</Text>
        </View>
      ) : null}
    </View>
  );
}

export { TodoEditor };
export type { TodoEditorMode, TodoEditorVisibility };
