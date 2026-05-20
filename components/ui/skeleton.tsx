import { View } from "react-native";

import { cn } from "@/lib/utils";

function Skeleton({
  className,
  shape = "rect",
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & { shape?: "text" | "rect" | "circle" }) {
  return (
    <View
      className={cn(
        "animate-pulse bg-accent",
        shape === "circle" && "rounded-full",
        shape === "rect" && "rounded-md",
        shape === "text" && "h-4 rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export { Skeleton };
