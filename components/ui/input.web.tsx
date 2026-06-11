import * as React from "react";
import { TextInput } from "react-native";

import { cn } from "@/lib/utils";

import { type InputVariantProps, inputVariants } from "./input-variants";

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
}: React.ComponentProps<typeof TextInput> & React.RefAttributes<TextInput> & InputVariantProps) {
  const isComposingRef = React.useRef(false);
  const onChangeTextRef = React.useRef(onChangeText);
  onChangeTextRef.current = onChangeText;

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

  React.useEffect(() => {
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
  }, []);

  return (
    <TextInput
      ref={setRef}
      className={cn(
        inputVariants({ variant, size }),
        props.editable === false &&
          "opacity-50 disabled:pointer-events-none disabled:cursor-not-allowed",
        "outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm",
        "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className,
      )}
      onBlur={(event) => {
        onBlur?.(event);
      }}
      onFocus={(event) => {
        onFocus?.(event);
      }}
      onChangeText={handleChangeText}
      value={isControlled ? localValue : undefined}
      defaultValue={isControlled ? undefined : defaultValue}
      style={style}
      {...props}
    />
  );
}

export { Input };
