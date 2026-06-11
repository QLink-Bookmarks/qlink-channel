import * as React from "react";
import { Platform, TextInput } from "react-native";

import { useIsInsideSheet } from "@/components/layout/sheet";
import { getThemeTokens } from "@/lib/theme";
import { cn } from "@/lib/utils";
import { useDisplaySettings } from "@/stores/display-settings";
import { BottomSheetTextInput } from "@gorhom/bottom-sheet";

import { type VariantProps, cva } from "class-variance-authority";

// react-native-web's TextInput strips React-style onCompositionStart/End props before they
// reach the underlying <input>, AND its controlled-input bookkeeping rewrites the DOM value
// back to props.value on every change. Together those make Hangul IME composition produce the
// classic "한" → "ㅎ하한" duplication: each intermediate jamo (a) escapes into state because no
// compositionstart handler ever fires to suppress it and (b) collides with the controlled
// reconciliation when state lags the IME. We fix both by attaching composition listeners
// imperatively (below) and by feeding the inner TextInput a locally-mirrored value so the
// controlled reconciliation always matches what the IME is showing.

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
  ref,
  ...props
}: React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> &
  VariantProps<typeof inputVariants>) {
  const accent = useDisplaySettings((state) => state.display.accent);
  const theme = useDisplaySettings((state) => state.display.theme);
  const tokens = React.useMemo(() => getThemeTokens(theme, accent), [accent, theme]);
  const [isFocused, setIsFocused] = React.useState(false);
  // BottomSheetModal's gesture handler only intercepts touches on native (Android in particular),
  // where it breaks Korean IME composition inside a regular TextInput. We swap to
  // BottomSheetTextInput just there. On web the gesture handler doesn't apply, our own
  // compositionstart/end handling below covers IME, and keeping the plain TextInput means
  // NativeWind tags it as a styled component so the `className` prop continues to apply.
  const isInsideSheet = useIsInsideSheet();
  const shouldUseBottomSheetInput = isInsideSheet && Platform.OS !== "web";
  // Cast through unknown — RNGH's TextInput type tree differs from RN's by a $$typeof brand,
  // but the runtime component accepts the same prop surface.
  const TextInputComponent = (shouldUseBottomSheetInput
    ? BottomSheetTextInput
    : TextInput) as unknown as typeof TextInput;
  // Tracks whether the IME is mid-composition. While true we stop propagating onChangeText to
  // the caller so their state doesn't fight the IME; we also keep the locally mirrored value
  // updated so RNW's controlled-input reconciliation matches what the IME currently shows.
  const isComposingRef = React.useRef(false);
  // Keep the latest onChangeText reachable from the imperative listeners without re-attaching
  // them on every render.
  const onChangeTextRef = React.useRef(onChangeText);
  onChangeTextRef.current = onChangeText;

  // Mirror the controlled value locally. This is the value we hand to the underlying TextInput.
  // During composition we update it eagerly from input events so RNW's value-reconciliation
  // never resets the DOM input back to a stale parent state mid-syllable. We sync from the
  // parent `value` prop only when not composing.
  //
  // Controlled vs uncontrolled is fixed at mount time (by whether `value` was passed) so we
  // never trigger React's "controlled changing to uncontrolled" warning if the parent briefly
  // passes undefined later.
  const isControlledRef = React.useRef(value !== undefined);
  const isControlled = isControlledRef.current;
  const externalValue = typeof value === "string" ? value : value == null ? "" : String(value);
  const [localValue, setLocalValue] = React.useState<string>(isControlled ? externalValue : "");
  React.useEffect(() => {
    if (!isControlled || isComposingRef.current) {
      return;
    }
    setLocalValue(externalValue);
  }, [externalValue, isControlled]);

  const handleChangeText = React.useCallback((text: string) => {
    setLocalValue(text);
    if (isComposingRef.current) {
      return;
    }
    onChangeTextRef.current?.(text);
  }, []);

  const innerRef = React.useRef<TextInput | null>(null);
  const setRef = React.useCallback(
    (node: TextInput | null) => {
      innerRef.current = node;
      if (typeof ref === "function") {
        ref(node);
      } else if (ref) {
        (ref as React.MutableRefObject<TextInput | null>).current = node;
      }
    },
    [ref],
  );

  // Attach compositionstart/compositionend directly to the underlying DOM input. RNW's
  // TextInput drops those props from its supportedProps list, so the React-style handlers we
  // used to spread would never reach the <input>. Attaching imperatively bypasses that filter
  // and keeps the in-flight Hangul syllable from leaking into state.
  React.useEffect(() => {
    if (Platform.OS !== "web") {
      return;
    }
    const node = innerRef.current as unknown as HTMLElement | null;
    if (!node) {
      return;
    }
    const handleStart = () => {
      isComposingRef.current = true;
    };
    const handleEnd = (event: Event) => {
      isComposingRef.current = false;
      const target = event.target as HTMLInputElement | HTMLTextAreaElement | null;
      if (target) {
        setLocalValue(target.value);
        onChangeTextRef.current?.(target.value);
      }
    };
    node.addEventListener("compositionstart", handleStart);
    node.addEventListener("compositionend", handleEnd);
    return () => {
      node.removeEventListener("compositionstart", handleStart);
      node.removeEventListener("compositionend", handleEnd);
    };
  }, [shouldUseBottomSheetInput]);

  return (
    <TextInputComponent
      ref={setRef}
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
      value={isControlled ? localValue : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
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
      {...props}
    />
  );
}

export { Input };
