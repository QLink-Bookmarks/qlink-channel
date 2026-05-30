import { Pressable, View } from "react-native";

import { SegmentedControl, type SegmentedControlProps } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import type { LinkOrder } from "@/features/links/types";
import { cn } from "@/lib/utils";

const ORDER_OPTIONS: { label: string; value: LinkOrder }[] = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "earliest" },
  { label: "가나다순", value: "laxico" },
];

type OrderFilterProps = {
  value: LinkOrder;
  onValueChange: (value: LinkOrder) => void;
  variant?: SegmentedControlProps["variant"];
  className?: string;
};

function OrderFilter({
  value,
  onValueChange,
  variant = "chipsBadge",
  className,
}: OrderFilterProps) {
  const isBadge = variant === "chipsBadge";

  return (
    <View className={cn("flex-row items-center gap-2", className)}>
      <SegmentedControl
        labelClassName="text-sm"
        options={ORDER_OPTIONS}
        selectionMode="single"
        value={value}
        variant={variant}
        onValueChange={(next) => {
          if (typeof next === "string") {
            onValueChange(next as LinkOrder);
          }
        }}
      />
      <Pressable
        className={cn(
          "min-h-8 flex-row items-center justify-center border border-border bg-card px-2.5",
          isBadge ? "rounded-full" : "rounded-xl",
        )}
        onPress={() => {
          console.log("home:filter:select");
        }}
      >
        <Text className="text-sm font-medium text-muted-foreground">선택</Text>
      </Pressable>
    </View>
  );
}

export { ORDER_OPTIONS, OrderFilter };
export type { OrderFilterProps };
