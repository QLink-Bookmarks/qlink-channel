import * as React from "react";
import { Platform, TextInput } from "react-native";

import { getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";

const Textarea = React.forwardRef<
  TextInput,
  React.ComponentProps<typeof TextInput> & { variant?: "default" | "memo" }
>(function Textarea(
  {
    className,
    variant = "default",
    multiline = true,
    numberOfLines = Platform.select({ web: 2, native: 8 }), // On web, numberOfLines also determines initial height. On native, it determines the maximum height.
    onBlur,
    onFocus,
    placeholderClassName,
    style,
    ...props
  },
  ref,
) {
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const tokens = React.useMemo(() => getThemeTokens(theme, accent), [accent, theme]);
  const [isFocused, setIsFocused] = React.useState(false);

  return (
    <TextInput
      ref={ref}
      className={cn(
        "scrollbar-none flex min-h-16 w-full flex-row rounded-md border border-input px-3 py-2 text-base text-foreground shadow-sm shadow-black/5 dark:bg-input/30 md:text-sm",
        variant === "memo" ? "bg-surface-elevated" : "bg-transparent",
        Platform.select({
          web: "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive field-sizing-content resize-y outline-none transition-[color,box-shadow] placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed",
        }),
        props.editable === false && "opacity-50",
        className,
      )}
      onBlur={(event) => {
        setIsFocused(false);
        onBlur?.(event);
      }}
      onFocus={(event) => {
        setIsFocused(true);
        onFocus?.(event);
      }}
      placeholderClassName={cn("text-muted-foreground", placeholderClassName)}
      multiline={multiline}
      numberOfLines={numberOfLines}
      style={[
        Platform.OS !== "web" && isFocused
          ? {
              borderColor: tokens.ring,
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px ${tokens.primary}26`,
            }
          : undefined,
        style,
      ]}
      textAlignVertical="top"
      {...props}
    />
  );
});

export { Textarea };
