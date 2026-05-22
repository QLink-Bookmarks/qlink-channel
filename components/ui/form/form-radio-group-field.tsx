import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";
import { View } from "react-native";

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { FormField } from "./form-field";
import { type SharedFormFieldProps, joinIds, useResolvedControl } from "./types";

type FormRadioOption = {
  disabled?: boolean;
  label: React.ReactNode;
  value: string;
};

type FormRadioGroupFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = SharedFormFieldProps<TFieldValues, TName> & {
  disabled?: boolean;
  onValueChange?: (nextValue: string) => void;
  optionLabelClassName?: string;
  options: FormRadioOption[];
  orientation?: "horizontal" | "vertical";
  radioSize?: "sm" | "md";
};

function FormRadioGroupField<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
>({
  control,
  description,
  disabled = false,
  fieldClassName,
  label,
  labelClassName,
  messageClassName,
  name,
  onValueChange,
  optionLabelClassName,
  options,
  orientation = "vertical",
  radioSize = "md",
  required = false,
}: FormRadioGroupFieldProps<TFieldValues, TName>) {
  const resolvedControl = useResolvedControl(control);
  const {
    field,
    fieldState: { error },
  } = useController({
    control: resolvedControl,
    disabled,
    name,
  });
  const fieldId = React.useId();
  const labelId = `${fieldId}-label`;
  const descriptionId = description ? `${fieldId}-description` : undefined;
  const messageId = error?.message ? `${fieldId}-message` : undefined;
  const isDisabled = disabled || field.disabled;

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
      <RadioGroup
        value={typeof field.value === "string" ? field.value : ""}
        disabled={isDisabled}
        orientation={orientation}
        onValueChange={(nextValue) => {
          field.onChange(nextValue);
          onValueChange?.(nextValue);
        }}
        aria-describedby={joinIds(descriptionId, messageId)}
        aria-invalid={error ? true : undefined}
        aria-labelledby={label ? labelId : undefined}
      >
        {options.map((option) => (
          <View
            key={option.value}
            className="flex-row items-center gap-3"
          >
            <RadioGroupItem
              value={option.value}
              disabled={isDisabled || option.disabled}
              size={radioSize}
            />
            {typeof option.label === "string" ? (
              <Text className={cn("text-base text-foreground", optionLabelClassName)}>
                {option.label}
              </Text>
            ) : (
              option.label
            )}
          </View>
        ))}
      </RadioGroup>
    </FormField>
  );
}

export { FormRadioGroupField };
export type { FormRadioGroupFieldProps, FormRadioOption };
