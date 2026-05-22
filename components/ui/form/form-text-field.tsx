import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import { Input } from "@/components/ui/input";

import { FormField } from "./form-field";
import { type SharedFormFieldProps, joinIds, useResolvedControl } from "./types";

type FormTextFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = SharedFormFieldProps<TFieldValues, TName> &
  Omit<React.ComponentProps<typeof Input>, "defaultValue" | "value">;

function FormTextField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  control,
  description,
  fieldClassName,
  label,
  labelClassName,
  messageClassName,
  name,
  onBlur,
  onChangeText,
  required = false,
  ...inputProps
}: FormTextFieldProps<TFieldValues, TName>) {
  const resolvedControl = useResolvedControl(control);
  const {
    field,
    fieldState: { error },
  } = useController({
    control: resolvedControl,
    name,
  });
  const fieldId = React.useId();
  const labelId = `${fieldId}-label`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const messageId = error?.message ? `${fieldId}-message` : undefined;

  return (
    <FormField
      label={label}
      description={description}
      error={error?.message}
      required={required}
      className={fieldClassName}
      labelClassName={labelClassName}
      messageClassName={messageClassName}
      labelId={label ? labelId : undefined}
      descriptionId={descriptionId}
      messageId={messageId}
    >
      <Input
        {...inputProps}
        ref={field.ref}
        value={typeof field.value === "string" ? field.value : (field.value ?? "").toString()}
        editable={inputProps.editable ?? !field.disabled}
        onBlur={(event) => {
          field.onBlur();
          onBlur?.(event);
        }}
        onChangeText={(nextValue) => {
          field.onChange(nextValue);
          onChangeText?.(nextValue);
        }}
        aria-describedby={joinIds(descriptionId, messageId)}
        aria-invalid={error ? true : undefined}
        aria-labelledby={label ? labelId : undefined}
      />
    </FormField>
  );
}

export { FormTextField };
export type { FormTextFieldProps };
