import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { View } from "react-native";

import { Checkbox } from "@/components/ui/checkbox";

import { FormField, FormLabel } from "./form-field";
import { type SharedFormFieldProps, useResolvedControl } from "./types";

type FormCheckboxFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = SharedFormFieldProps<TFieldValues, TName> &
  Omit<React.ComponentProps<typeof Checkbox>, "checked" | "onCheckedChange"> & {
    onCheckedChange?: React.ComponentProps<typeof Checkbox>["onCheckedChange"];
  };

function FormCheckboxField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  description,
  fieldClassName,
  label,
  messageClassName,
  name,
  onCheckedChange,
  required = false,
  ...checkboxProps
}: FormCheckboxFieldProps<TFieldValues, TName>) {
  const resolvedControl = useResolvedControl(control);
  const {
    field,
    fieldState: { error },
  } = useController({
    control: resolvedControl,
    disabled: checkboxProps.disabled,
    name,
  });
  const isDisabled = checkboxProps.disabled || field.disabled;

  return (
    <FormField
      description={description}
      error={error?.message}
      className={fieldClassName}
      messageClassName={messageClassName}
    >
      <View className="flex-row items-center gap-3">
        <Checkbox
          {...checkboxProps}
          checked={Boolean(field.value)}
          disabled={isDisabled}
          onCheckedChange={(nextChecked) => {
            field.onChange(nextChecked);
            onCheckedChange?.(nextChecked);
          }}
          aria-invalid={error ? true : undefined}
        />
        {label ? <FormLabel required={required}>{label}</FormLabel> : null}
      </View>
    </FormField>
  );
}

export { FormCheckboxField };
export type { FormCheckboxFieldProps };
