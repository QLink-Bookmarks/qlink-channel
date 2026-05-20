import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function EmptyState({
  className,
  emoji,
  title,
  description,
  actions,
  ...props
}: React.ComponentProps<typeof View> & {
  emoji?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}) {
  return (
    <View
      className={cn("items-center justify-center gap-3 px-6 py-10", className)}
      {...props}
    >
      {emoji ? <Text className="text-5xl">{emoji}</Text> : null}
      <View className="items-center gap-1">
        <Text className="text-center text-lg font-semibold">{title}</Text>
        {description ? (
          <Text className="text-center text-sm text-muted-foreground">{description}</Text>
        ) : null}
      </View>
      {actions ? <View className="mt-1 flex-row gap-2">{actions}</View> : null}
    </View>
  );
}

export { EmptyState };
