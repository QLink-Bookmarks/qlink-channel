import { Pressable, View } from "react-native";

import { SegmentedControl } from "@/components/ui/segmented-control";
import { Text } from "@/components/ui/text";
import type { LinkOrder } from "@/features/links/types";

const ORDER_OPTIONS: { label: string; value: LinkOrder }[] = [
  { label: "최신순", value: "latest" },
  { label: "오래된순", value: "earliest" },
  { label: "가나다순", value: "laxico" },
];

type OrderFilterProps = {
  value: LinkOrder;
  onValueChange: (value: LinkOrder) => void;
  className?: string;
};

function OrderFilter({ value, onValueChange, className }: OrderFilterProps) {
  return (
    <View className={className}>
      <View className="flex-row flex-wrap items-center gap-2">
        <SegmentedControl
          options={ORDER_OPTIONS}
          selectionMode="single"
          value={value}
          variant="chipsRound"
          onValueChange={(next) => {
            if (typeof next === "string") {
              onValueChange(next as LinkOrder);
            }
          }}
        />
        <Pressable
          className="min-h-8 flex-row items-center justify-center rounded-xl border border-border bg-card px-2.5"
          onPress={() => {
            console.log("home:filter:select");
          }}
        >
          <Text className="text-sm font-medium text-muted-foreground">선택</Text>
        </Pressable>
      </View>
    </View>
  );
}

export { ORDER_OPTIONS, OrderFilter };
export type { OrderFilterProps };
