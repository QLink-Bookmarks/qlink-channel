import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { Image } from "expo-image";

type FaviconProps = React.ComponentProps<typeof View> & {
  url?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  shape?: "rounded" | "circle";
};

function Favicon({
  url,
  fallback,
  size = "md",
  shape = "rounded",
  className,
  ...props
}: FaviconProps) {
  const sizeClass = size === "sm" ? "size-6" : size === "lg" ? "size-10" : "size-8";

  return (
    <View
      className={cn(
        "items-center justify-center overflow-hidden border border-border-soft bg-muted",
        sizeClass,
        shape === "circle" ? "rounded-full" : "rounded-lg",
        className,
      )}
      {...props}
    >
      {url ? (
        <Image
          source={{ uri: url }}
          className="size-full"
          contentFit="cover"
        />
      ) : (
        <Text className="text-xs font-semibold text-muted-foreground">{fallback ?? "?"}</Text>
      )}
    </View>
  );
}

export { Favicon };
export type { FaviconProps };
