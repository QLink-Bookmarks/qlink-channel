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
  accent = DEFAULT_ACCENT,
  color,
  backgroundColor,
  disabled,
  style,
  ...props
}: React.ComponentProps<typeof Pressable> & {
  icon: LucideIcon;
  size?: keyof typeof iconButtonSizes;
  accent?: AccentName;
  color?: string;
  backgroundColor?: string;
}) {
  const tokens = React.useMemo(() => getThemeTokens("light", accent), [accent]);
  const sizeConfig = iconButtonSizes[size];
  const defaultIconColor = color ?? tokens.accentForeground;
  const activeBackgroundColor = backgroundColor ?? tokens.accent;

  return (
    <Pressable
      className={cn(
        "items-center justify-center overflow-hidden",
        Platform.select({
          web: !disabled
            ? "transition-colors duration-150 ease-out hover:bg-accent focus-visible:bg-accent"
            : undefined,
        }),
        sizeConfig.button,
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
