import { Pressable, View } from "react-native";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function TodoItem({
  className,
  variant = "row",
  text,
  done,
  badge,
  visibility,
  overdue,
  onToggle,
  onPress,
}: {
  className?: string;
  variant?: "inline" | "row" | "display";
  text: string;
  done?: boolean;
  badge?: string;
  visibility?: "public" | "private";
  overdue?: boolean;
  onToggle?: (done: boolean) => void;
  onPress?: () => void;
}) {
  return (
    <Pressable
      className={cn(
        "flex-row items-center gap-3 rounded-xl border border-border-soft bg-surface p-3",
        variant === "inline" && "border-transparent bg-transparent p-0",
        variant === "display" && "items-start rounded-2xl p-4",
        className,
      )}
      onPress={onPress}
    >
      <Checkbox
        checked={done ?? false}
        shape="round"
        onCheckedChange={(value) => onToggle?.(value === true)}
      />
      <View className="flex-1 gap-1">
        <Text
          className={cn(
            "text-sm",
            done && "text-muted-foreground line-through",
            overdue && "text-destructive",
          )}
        >
          {text}
        </Text>
        <View className="flex-row flex-wrap gap-1.5">
          {badge ? (
            <Badge variant={overdue ? "overdue" : "todo"}>
              <Text>{badge}</Text>
            </Badge>
          ) : null}
          {visibility ? (
            <Badge variant={visibility}>
              <Text>{visibility}</Text>
            </Badge>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
}

export { TodoItem };
