import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

// View scope: 모바일 전용. md >= 768px에서는 사용하지 않는다.

function AccountRow({
  className,
  label,
  value,
  actionLabel,
  destructive,
  onActionPress,
}: {
  className?: string;
  label: string;
  value?: string;
  actionLabel?: string;
  destructive?: boolean;
  onActionPress?: () => void;
}) {
  return (
    <View
      className={cn(
        "flex-row items-center justify-between gap-3 rounded-2xl border border-border-soft bg-card p-4",
        className,
      )}
    >
      <View className="flex-1 gap-1">
        <Text className="text-xs text-muted-foreground">{label}</Text>
        {value ? <Text className="font-medium">{value}</Text> : null}
      </View>
      {actionLabel ? (
        <Pressable onPress={onActionPress}>
          <Text
            className={cn("text-sm font-semibold text-primary", destructive && "text-destructive")}
          >
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export { AccountRow };
