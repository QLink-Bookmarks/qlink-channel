import { Pressable, View } from "react-native";

import { LinearGradient } from "@/components/ui/linear-gradient";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Toast({
  className,
  variant = "default",
  title,
  description,
  onDismiss,
  ...props
}: React.ComponentProps<typeof View> & {
  variant?: "default" | "success" | "error" | "gradient";
  title: string;
  description?: string;
  onDismiss?: () => void;
}) {
  return (
    <View
      className={cn(
        "relative w-full max-w-sm overflow-hidden rounded-2xl border border-border shadow-qlink-lg",
        className,
      )}
      {...props}
    >
      {variant === "gradient" ? (
        <LinearGradient className="absolute inset-0" />
      ) : (
        <View
          className={cn(
            "absolute inset-0 bg-foreground",
            variant === "success" && "bg-success",
            variant === "error" && "bg-destructive",
          )}
        />
      )}
      <View className="flex-row items-start justify-between gap-4 p-4">
        <View className="flex-1 gap-1">
          <Text className="font-semibold text-background">{title}</Text>
          {description ? <Text className="text-sm text-background/80">{description}</Text> : null}
        </View>
        {onDismiss ? (
          <Pressable
            className="rounded-md px-1"
            onPress={onDismiss}
          >
            <Text className="text-sm font-medium text-background">닫기</Text>
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

export { Toast };
