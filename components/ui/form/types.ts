import type { Control, FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { useFormContext } from "react-hook-form";

type SharedFormFieldProps<
  TFieldValues extends FieldValues,
  TName extends FieldPath<TFieldValues>,
> = {
  control?: Control<TFieldValues>;
  description?: React.ReactNode;
  fieldClassName?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  messageClassName?: string;
  name: TName;
  required?: boolean;
};

function joinIds(...ids: (string | undefined)[]) {
  const value = ids.filter(Boolean).join(" ");

  return value.length > 0 ? value : undefined;
}

function useResolvedControl<TFieldValues extends FieldValues>(control?: Control<TFieldValues>) {
  const methods = useFormContext<TFieldValues>() as UseFormReturn<TFieldValues> | undefined;
  const resolvedControl = control ?? methods?.control;

  if (!resolvedControl) {
    throw new Error("Form components require FormProvider or an explicit control prop.");
  }

  return resolvedControl;
}

export { joinIds, useResolvedControl };
export type { SharedFormFieldProps };
