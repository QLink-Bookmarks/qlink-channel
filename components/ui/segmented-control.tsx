import { Pressable, View } from "react-native";

import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type SegmentedOption = {
  label: string;
  value: string;
  disabled?: boolean;
};

type SegmentedControlProps = React.ComponentProps<typeof View> & {
  value: string | string[];
  options: SegmentedOption[];
  variant?: "chips" | "chipsBadge" | "chipsRound" | "pills" | "cells";
  selectionMode?: "single" | "multiple";
  block?: boolean;
  onValueChange?: (value: string | string[]) => void;
};

function SegmentedControl({
  value,
  options,
  variant = "pills",
  selectionMode = "single",
  block,
  className,
  onValueChange,
  ...props
}: SegmentedControlProps) {
  const isChipVariant = variant === "chips" || variant === "chipsRound" || variant === "chipsBadge";
  const selectedValues = Array.isArray(value) ? value : [value];

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
        const selected = selectedValues.includes(option.value);

        return (
          <Pressable
            key={option.value}
            disabled={option.disabled}
            className={cn(
              "min-h-9 flex-row items-center justify-center rounded-xl px-3",
              block && "flex-1",
              variant === "cells" && "rounded-lg",
              variant === "chips" && "min-h-8 rounded-lg border border-border bg-card px-2.5",
              variant === "chipsRound" && "min-h-8 rounded-xl border border-border bg-card px-2.5",
              variant === "chipsBadge" &&
                "min-h-8 rounded-full border border-border bg-card px-2.5",
              selected && cn("bg-primary", isChipVariant && "border-primary shadow-qlink-sm"),
              option.disabled && "opacity-50",
            )}
            onPress={() => {
              if (selectionMode === "multiple") {
                const nextValue = selected
                  ? selectedValues.filter((currentValue) => currentValue !== option.value)
                  : [...selectedValues, option.value];

                onValueChange?.(nextValue);
                return;
              }

              onValueChange?.(option.value);
            }}
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
