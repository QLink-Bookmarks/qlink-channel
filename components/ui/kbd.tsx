import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

function Kbd({
  className,
  children,
  size = "sm",
  label,
  ...props
}: React.ComponentProps<typeof View> & { size?: "xs" | "sm"; label?: string }) {
  return (
    <View
      className={cn("flex-row items-center gap-1.5", className)}
      {...props}
    >
      <View
        className={cn(
          "items-center justify-center rounded-xs border border-border-soft bg-surface-elevated",
          size === "xs" ? "min-h-5 px-1.5" : "min-h-6 px-2",
        )}
      >
        <Text
          className={cn(
            "font-mono font-medium text-muted-foreground",
            size === "xs" ? "text-2xs" : "text-xs",
          )}
        >
          {children}
        </Text>
      </View>
      {label ? (
        <Text className={cn("text-muted-foreground", size === "xs" ? "text-2xs" : "text-xs")}>
          {label}
        </Text>
      ) : null}
    </View>
  );
}

export { Kbd };
