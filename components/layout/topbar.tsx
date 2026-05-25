import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Input } from "@/components/ui/input";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react-native";

// View scope: 와이드뷰 전용. md >= 768px에서 사용한다.

type TopbarSearchAction = {
  label?: string;
  icon?: LucideIcon;
  onPress?: () => void;
};

function Topbar({
  className,
  variant = "search",
  searchValue,
  placeholder = "검색",
  searchLeftSlot,
  searchRightSlot,
  searchAction,
  actions,
  searchReadOnly,
  onSearchPress,
  onSearchChange,
  onSubmit,
  ...props
}: React.ComponentProps<typeof View> & {
  variant?: "default" | "search";
  searchValue?: string;
  placeholder?: string;
  searchLeftSlot?: React.ReactNode;
  searchRightSlot?: React.ReactNode;
  searchAction?: TopbarSearchAction;
  actions?: React.ReactNode;
  searchReadOnly?: boolean;
  onSearchPress?: () => void;
  onSearchChange?: (value: string) => void;
  onSubmit?: () => void;
}) {
  const SearchContainer = searchReadOnly ? Pressable : View;

  return (
    <View
      className={cn(
        "hidden min-h-16 flex-row items-center gap-3 border-b border-border-soft bg-background px-5 md:flex",
        className,
      )}
      {...props}
    >
      <SearchContainer
        className={cn(
          "max-w-xl flex-1 flex-row items-center gap-2 border border-input px-3 shadow-sm shadow-black/5",
          variant === "search" ? "rounded-full bg-card py-1" : "rounded-2xl bg-card py-1",
          searchReadOnly && "web:cursor-pointer web:hover:border-primary",
        )}
        onPress={searchReadOnly ? onSearchPress : undefined}
      >
        {searchLeftSlot ? <View className="shrink-0">{searchLeftSlot}</View> : null}
        <Input
          editable={!searchReadOnly}
          variant="inline"
          className={cn(
            "flex-1 border-none px-0 py-0",
            variant === "search" ? "text-sm" : "text-base",
            searchReadOnly && "web:pointer-events-none",
          )}
          placeholder={placeholder}
          value={searchValue}
          onChangeText={onSearchChange}
          onSubmitEditing={onSubmit}
        />
        {searchRightSlot ? <View className="shrink-0">{searchRightSlot}</View> : null}
        {searchAction ? (
          <Pressable
            className={cn(
              "min-h-9 min-w-9 flex-row items-center justify-center gap-1 rounded-full bg-accent px-3",
            )}
            onPress={searchAction.onPress}
          >
            {searchAction.icon ? (
              <Icon
                as={searchAction.icon}
                className="size-4 text-foreground"
              />
            ) : null}
            {searchAction.label ? (
              <Text className="text-xs font-medium">{searchAction.label}</Text>
            ) : null}
          </Pressable>
        ) : null}
      </SearchContainer>
      <View className="flex-row items-center gap-2">{actions}</View>
    </View>
  );
}

export { Topbar };
export type { TopbarSearchAction };
