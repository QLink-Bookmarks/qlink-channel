import type { Control, FieldValues } from "react-hook-form";
import { useFormState } from "react-hook-form";

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

import { useResolvedControl } from "./types";

import { CircleAlert } from "lucide-react-native/icons";

type FormRootErrorProps<TFieldValues extends FieldValues> = {
  className?: string;
  control?: Control<TFieldValues>;
  title?: string;
};

function FormRootError<TFieldValues extends FieldValues = FieldValues>({
  className,
  control,
  title = "Unable to continue",
}: FormRootErrorProps<TFieldValues>) {
  const resolvedControl = useResolvedControl(control);
  const { errors } = useFormState({ control: resolvedControl });
  const message =
    typeof errors.root?.serverError?.message === "string" ? errors.root.serverError.message : null;

  if (!message) {
    return null;
  }

  return (
    <Alert
      icon={CircleAlert}
      variant="destructive"
      className={className}
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  );
}

export { FormRootError };
