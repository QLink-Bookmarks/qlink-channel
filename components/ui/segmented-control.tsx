import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SegmentedOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SegmentedControlProps = React.ComponentProps<typeof View> & {
  value: string;
  options: SegmentedOption[];
  variant?: "chips" | "chipsBadge" | "chipsRound" | "pills" | "cells";
  block?: boolean;
  onValueChange?: (value: string) => void;
};

function SegmentedControl({
  value,
  options,
  variant = "pills",
  block,
  className,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  const isChipVariant = variant === "chips" || variant === "chipsRound" || variant === "chipsBadge";

  return (
    <View
      className={cn(
        "flex-row gap-1 rounded-2xl border border-border bg-surface-elevated p-1",
        isChipVariant && "border-transparent bg-transparent p-0",
        block && "w-full",
        className,
      )}
      {...props}
    >
      {options.map((option) => {
        const selected = option.value === value;

        return (
          <Pressable
            key={option.value}
            disabled={option.disabled}
            className={cn(
              "min-h-9 flex-row items-center justify-center rounded-xl px-3",
              block && "flex-1",
              variant === "cells" && "rounded-lg",
              variant === "chips" && "rounded-lg border border-border bg-card",
              variant === "chipsRound" && "rounded-xl border border-border bg-card",
              variant === "chipsBadge" && "rounded-full border border-border bg-card",
              selected && cn("bg-primary", isChipVariant && "border-primary shadow-qlink-sm"),
              option.disabled && "opacity-50",
            )}
            onPress={() => onValueChange?.(option.value)}
          >
            <Text
              className={cn(
                "text-sm font-medium",
                selected ? "text-primary-foreground" : "text-muted-foreground",
              )}
            >
              {option.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export { SegmentedControl };
export type { SegmentedControlProps, SegmentedOption };
