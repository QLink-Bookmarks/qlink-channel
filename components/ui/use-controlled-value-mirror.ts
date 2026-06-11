import * as React from "react";

type UseControlledValueMirrorOptions = {
  value: string | number | readonly string[] | undefined;
  defaultValue: string | number | readonly string[] | undefined;
  onChangeText: ((text: string) => void) | undefined;
  isComposingRef?: React.MutableRefObject<boolean>;
};

function toStringValue(value: string | number | readonly string[] | undefined): string {
  if (typeof value === "string") return value;
  if (value == null) return "";
  return String(value);
}

function useControlledValueMirror({
  value,
  defaultValue,
  onChangeText,
  isComposingRef,
}: UseControlledValueMirrorOptions) {
  const isControlledRef = React.useRef(value !== undefined);
  const isControlled = isControlledRef.current;
  const externalValue = toStringValue(value);
  const [localValue, setLocalValue] = React.useState<string>(isControlled ? externalValue : "");

  const onChangeTextRef = React.useRef(onChangeText);
  onChangeTextRef.current = onChangeText;

  React.useEffect(() => {
    if (!isControlled) return;
    if (isComposingRef?.current) return;
    setLocalValue(externalValue);
  }, [externalValue, isControlled, isComposingRef]);

  const handleChangeText = React.useCallback(
    (text: string) => {
      setLocalValue(text);
      if (isComposingRef?.current) return;
      onChangeTextRef.current?.(text);
    },
    [isComposingRef],
  );

  const commit = React.useCallback((text: string) => {
    setLocalValue(text);
    onChangeTextRef.current?.(text);
  }, []);

  return {
    isControlled,
    inputValue: isControlled ? localValue : undefined,
    inputDefaultValue: isControlled
      ? undefined
      : typeof defaultValue === "string"
        ? defaultValue
        : undefined,
    handleChangeText,
    commit,
  };
}

export { useControlledValueMirror };
