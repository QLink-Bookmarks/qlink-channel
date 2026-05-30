import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react-native";

type TopbarSearchAction = {
  label?: string;
  icon?: LucideIcon;
  onPress?: () => void;
};

function TopbarSearchField({
  className,
  variant = "search",
  value,
  placeholder = "검색",
  leftSlot,
  rightSlot,
  action,
  readOnly,
  onPress,
  onChange,
  onSubmit,
}: React.ComponentProps<typeof View> & {
  variant?: "default" | "search";
  value?: string;
  placeholder?: string;
  leftSlot?: React.ReactNode;
  rightSlot?: React.ReactNode;
  action?: TopbarSearchAction;
  readOnly?: boolean;
  onPress?: () => void;
  onChange?: (value: string) => void;
  onSubmit?: () => void;
}) {
  const SearchContainer = readOnly ? Pressable : View;

  return (
    <SearchContainer
      className={cn(
        "flex-row items-center gap-2 border border-input px-3 shadow-sm shadow-black/5",
        variant === "search" ? "rounded-full bg-card py-1" : "rounded-2xl bg-card py-1",
        readOnly && "web:cursor-pointer web:hover:border-primary",
        className,
      )}
      onPress={readOnly ? onPress : undefined}
    >
      {leftSlot ? <View className="shrink-0">{leftSlot}</View> : null}
      <Input
        editable={!readOnly}
        variant="inline"
        className={cn(
          "flex-1 border-none px-0 py-0",
          variant === "search" ? "text-sm" : "text-base",
          readOnly && "web:pointer-events-none",
        )}
        placeholder={placeholder}
        value={value}
        onChangeText={onChange}
        onSubmitEditing={onSubmit}
      />
      {rightSlot ? <View className="shrink-0">{rightSlot}</View> : null}
      {action ? (
        <Pressable
          className="min-h-9 min-w-9 flex-row items-center justify-center gap-1 rounded-full bg-accent px-3"
          onPress={action.onPress}
        >
          {action.icon ? (
            <Icon
              as={action.icon}
              className="size-4 text-accent-foreground"
            />
          ) : null}
          {action.label ? (
            <Text className="text-xs font-medium text-accent-foreground">{action.label}</Text>
          ) : null}
        </Pressable>
      ) : null}
    </SearchContainer>
  );
}

export { TopbarSearchField };
export type { TopbarSearchAction };
