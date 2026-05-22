import * as React from "react";
import type { FieldPath, FieldValues } from "react-hook-form";
import { useController } from "react-hook-form";

import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { FormField } from "./form-field";
import { type SharedFormFieldProps, joinIds, useResolvedControl } from "./types";

type FormSelectOption = NonNullable<Option> & {
  disabled?: boolean;
};

type FormSelectFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = SharedFormFieldProps<TFieldValues, TName> & {
  contentClassName?: string;
  disabled?: boolean;
  groupLabel?: string;
  onValueChange?: (nextOption: FormSelectOption) => void;
  options: FormSelectOption[];
  placeholder?: string;
  portalHost?: string;
  triggerClassName?: string;
  triggerSize?: "default" | "sm";
};

function FormSelectField<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({
  contentClassName,
  control,
  description,
  disabled = false,
  fieldClassName,
  groupLabel,
  label,
  labelClassName,
  messageClassName,
  name,
  onValueChange,
  options,
  placeholder,
  portalHost,
  required = false,
  triggerClassName,
  triggerSize = "default",
}: FormSelectFieldProps<TFieldValues, TName>) {
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
  const selectedOption = options.find((option) => option.value === field.value);
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
      <Select
        value={selectedOption}
        disabled={isDisabled}
        onValueChange={(nextOption) => {
          if (!nextOption) {
            return;
          }

          field.onChange(nextOption.value);
          onValueChange?.(nextOption);
        }}
      >
        <SelectTrigger
          className={triggerClassName}
          disabled={isDisabled}
          size={triggerSize}
          aria-describedby={joinIds(descriptionId, messageId)}
          aria-invalid={error ? true : undefined}
          aria-labelledby={label ? labelId : undefined}
        >
          <SelectValue placeholder={placeholder ?? ""} />
        </SelectTrigger>
        <SelectContent
          className={contentClassName}
          portalHost={portalHost}
        >
          <SelectGroup>
            {groupLabel ? <SelectLabel>{groupLabel}</SelectLabel> : null}
            {options.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                label={option.label}
                disabled={option.disabled}
              />
            ))}
          </SelectGroup>
        </SelectContent>
      </Select>
    </FormField>
  );
}

export { FormSelectField };
export type { FormSelectFieldProps, FormSelectOption };
