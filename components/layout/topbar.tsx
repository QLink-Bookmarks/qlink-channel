import { View } from "react-native";

import { cn } from "@/lib/utils";

import { type TopbarSearchAction, TopbarSearchField } from "./topbar-search-field";

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
  return (
    <View
      className={cn(
        "hidden min-h-16 flex-row items-center gap-3 border-b border-border-soft bg-background px-5 md:flex",
        className,
      )}
      {...props}
    >
      <TopbarSearchField
        className={cn("max-w-xl flex-1")}
        action={searchAction}
        leftSlot={searchLeftSlot}
        onChange={onSearchChange}
        onPress={onSearchPress}
        onSubmit={onSubmit}
        placeholder={placeholder}
        readOnly={searchReadOnly}
        rightSlot={searchRightSlot}
        value={searchValue}
        variant={variant}
      />
      <View className="flex-row items-center gap-2">{actions}</View>
    </View>
  );
}

export { Topbar };
export type { TopbarSearchAction };
