import * as React from "react";
import { TextInput } from "react-native";

import { useIsInsideSheet } from "@/components/layout/sheet";
import { getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { type InputVariantProps, inputVariants } from "./input-variants";
import { useControlledValueMirror } from "./use-controlled-value-mirror";

function Input({
  className,
  variant,
  size,
  onBlur,
  onFocus,
  onChangeText,
  style,
  value,
  defaultValue,
  ...props
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput> & InputVariantProps) {
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const tokens = React.useMemo(() => getThemeTokens(theme, accent), [accent, theme]);
  const [isFocused, setIsFocused] = React.useState(false);
  const isInsideSheet = useIsInsideSheet();
  const TextInputComponent = (isInsideSheet
    ? BottomSheetTextInput
    : TextInput) as unknown as typeof TextInput;

  const { inputValue, inputDefaultValue, handleChangeText } = useControlledValueMirror({
    value,
    defaultValue,
    onChangeText,
  });

  return (
    <TextInputComponent
      className={cn(
        inputVariants({ variant, size }),
        props.editable === false && "opacity-50",
        "placeholder:text-muted-foreground/50",
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
      onChangeText={handleChangeText}
      value={inputValue}
      defaultValue={inputDefaultValue}
      style={[
        // The "inline" variant is borderless and lives inside a styled wrapper
        // (e.g. the search field), so drawing a focus border/ring on the inner
        // input would render a stray square inside the wrapper. Skip it there.
        isFocused && variant !== "inline"
          ? {
              borderColor: tokens.ring,
              borderWidth: 1.5,
              boxShadow: `0 0 0 3px ${tokens.primary}26`,
            }
          : undefined,
        style,
      ]}
      {...props}
    />
  );
}

export { Input };
