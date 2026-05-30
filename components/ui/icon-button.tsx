import * as React from "react";
import { Platform, Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { type AccentName, DEFAULT_ACCENT, getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react-native";

const iconButtonSizes = {
  sm: {
    button: "size-9 rounded-full",
    icon: 16,
  },
  md: {
    button: "size-11 rounded-full",
    icon: 18,
  },
  lg: {
    button: "size-14 rounded-full",
    icon: 22,
  },
} as const;

function IconButton({
  className,
  icon,
  size = "md",
  variant = "solid",
  accent = DEFAULT_ACCENT,
  color,
  backgroundColor,
  active = false,
  disabled,
  style,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  icon: LucideIcon;
  size?: keyof typeof iconButtonSizes;
  variant?: "solid" | "ghost";
  accent?: AccentName;
  color?: string;
  backgroundColor?: string;
  active?: boolean;
}) {
  const tokens = React.useMemo(() => getThemeTokens("light", accent), [accent]);
  const sizeConfig = iconButtonSizes[size];
  const defaultIconColor =
    color ?? (variant === "ghost" || !active ? tokens.primary : tokens.primaryForeground);
  const activeBackgroundColor =
    backgroundColor ?? (variant === "ghost" ? `${tokens.primary}14` : tokens.primary);

  return (
    <Pressable
      className={cn(
        "items-center justify-center overflow-hidden",
        Platform.select({
          web:
            !disabled && variant === "solid"
              ? "transition-colors duration-150 ease-out hover:bg-primary focus-visible:bg-primary"
              : undefined,
        }),
        sizeConfig.button,
        variant === "ghost" ? "bg-transparent" : active ? "bg-primary" : "bg-primary/10",
        disabled && "opacity-50",
        className,
      )}
      disabled={disabled}
      style={style}
      {...props}
    >
      {({ pressed }) => (
        <View
          className="items-center justify-center rounded-full"
          style={{
            backgroundColor: !disabled && pressed ? activeBackgroundColor : "transparent",
            height: "100%",
            width: "100%",
          }}
        >
          <Icon
            as={icon}
            color={defaultIconColor}
            size={sizeConfig.icon}
          />
        </View>
      )}
    </Pressable>
  );
}

export { IconButton };
