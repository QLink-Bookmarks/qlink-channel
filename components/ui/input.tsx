import * as React from "react";
import { Platform, TextInput } from "react-native";

import { useIsInsideSheet } from "@/components/layout/sheet";
import { getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { type VariantProps, cva } from "class-variance-authority";
import { cssInterop } from "nativewind";

// BottomSheetTextInput is rendered via react-native-gesture-handler's TextInput, which NativeWind
// doesn't tag as a styled component by default — so without this interop the `className` prop
// silently drops on web and the input loses its border, padding, height, etc.
cssInterop(BottomSheetTextInput, {
  className: "style",
});

const inputVariants = cva(
  "flex w-full min-w-0 flex-row items-center border border-input text-foreground shadow-sm shadow-black/5 dark:bg-input/30",
  {
    variants: {
      variant: {
        default: "rounded-md bg-background",
        search: "rounded-full bg-card",
        pill: "rounded-full bg-surface-elevated",
        inline: "rounded-none border-0 bg-transparent shadow-none",
      },
      size: {
        sm: "h-9 px-3 py-1 text-sm",
        md: "h-10 px-3 py-1 text-base leading-5",
        lg: "h-12 px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

type CompositionHandler = (event: { target: { value: string } }) => void;

function Input({
  className,
  variant,
  size,
  onBlur,
  onFocus,
  onChangeText,
  style,
  ...props
}: React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> &
  VariantProps<typeof inputVariants>) {
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const tokens = React.useMemo(() => getThemeTokens(theme, accent), [accent, theme]);
  const [isFocused, setIsFocused] = React.useState(false);
  // BottomSheetModal's gesture handler swallows touch events on Android, breaking Korean IME
  // composition inside a regular TextInput. BottomSheetTextInput pipes focus state back to the
  // sheet so the gesture handler stands down. We switch on it transparently.
  const isInsideSheet = useIsInsideSheet();
  // Cast through unknown — RNGH's TextInput type tree differs from RN's by a $$typeof brand,
  // but the runtime component accepts the same prop surface.
  const TextInputComponent = (isInsideSheet
    ? BottomSheetTextInput
    : TextInput) as unknown as typeof TextInput;
  // While the IME is composing (e.g. Hangul syllable assembly), the underlying <input> holds
  // intermediate state that React's controlled value would clobber on each re-render. We defer
  // propagating text until composition ends so the caller's state doesn't fight the IME.
  const isComposingRef = React.useRef(false);

  const handleChangeText = React.useCallback(
    (text: string) => {
      if (isComposingRef.current) {
        return;
      }
      onChangeText?.(text);
    },
    [onChangeText],
  );

  const compositionProps =
    Platform.OS === "web"
      ? ({
          onCompositionStart: () => {
            isComposingRef.current = true;
          },
          onCompositionEnd: ((event) => {
            isComposingRef.current = false;
            onChangeText?.(event.target.value);
          }) as CompositionHandler,
        } as Record<string, unknown>)
      : undefined;

  return (
    <TextInputComponent
      className={cn(
        inputVariants({ variant, size }),
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            }),
          ),
        Platform.select({
          web: cn(
            "outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
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
      {...compositionProps}
      {...props}
    />
  );
}

export { Input };
