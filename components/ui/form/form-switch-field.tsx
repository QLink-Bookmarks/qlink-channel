import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { View } from "react-native";

import { Switch } from "@/components/ui/switch";

import { FormField, FormLabel } from "./form-field";
import { type SharedFormFieldProps, useResolvedControl } from "./types";

type FormSwitchFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = SharedFormFieldProps<TFieldValues, TName> &
  Omit<React.ComponentProps<typeof Switch>, "checked" | "onCheckedChange"> & {
    onCheckedChange?: React.ComponentProps<typeof Switch>["onCheckedChange"];
  };

function FormSwitchField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  description,
  fieldClassName,
  label,
  messageClassName,
  name,
  onCheckedChange,
  required = false,
  ...switchProps
}: FormSwitchFieldProps<TFieldValues, TName>) {
  const resolvedControl = useResolvedControl(control);
  const {
    field,
    fieldState: { error },
  } = useController({
    control: resolvedControl,
    disabled: switchProps.disabled,
    name,
  });
  const isDisabled = switchProps.disabled || field.disabled;

  return (
    <FormField
      description={description}
      error={error?.message}
      className={fieldClassName}
      messageClassName={messageClassName}
    >
      <View className="flex-row items-center gap-3">
        <Switch
          {...switchProps}
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

export { FormSwitchField };
export type { FormSwitchFieldProps };
