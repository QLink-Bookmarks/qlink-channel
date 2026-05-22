import * as React from "react";
import { View, type ViewProps } from "react-native";

import { Label } from "@/components/ui/label";
import { Text } from "@/components/ui/text";
import { cn } from "@/lib/utils";

type FormFieldProps = ViewProps & {
  children?: React.ReactNode;
  controlClassName?: string;
  description?: React.ReactNode;
  descriptionClassName?: string;
  descriptionId?: string;
  error?: string;
  label?: React.ReactNode;
  labelClassName?: string;
  labelId?: string;
  messageClassName?: string;
  messageId?: string;
  required?: boolean;
};

type FormLabelProps = React.ComponentProps<typeof Label> & {
  required?: boolean;
  requiredIndicatorClassName?: string;
};

function FormControl({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("gap-2", className)}
      {...props}
    />
  );
}

function FormDescription({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text> & { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

function FormLabel({
  children,
  className,
  required = false,
  requiredIndicatorClassName,
  ...props
}: FormLabelProps) {
  return (
    <Label
      className={cn(className)}
      {...props}
    >
      <>
        {children}
        {required ? (
          <Text className={cn("text-destructive", requiredIndicatorClassName)}> *</Text>
        ) : null}
      </>
    </Label>
  );
}

function FormMessage({
  className,
  children,
  ...props
}: React.ComponentProps<typeof Text> & { children?: React.ReactNode }) {
  if (!children) {
    return null;
  }

  return (
    <Text
      className={cn("text-sm text-destructive", className)}
      {...props}
    >
      {children}
    </Text>
  );
}

function FormField({
  children,
  className,
  controlClassName,
  description,
  descriptionClassName,
  descriptionId,
  error,
  label,
  labelClassName,
  labelId,
  messageClassName,
  messageId,
  required = false,
  ...props
}: FormFieldProps) {
  return (
    <View
      className={cn("gap-2", className)}
      {...props}
    >
      {label ? (
        <FormLabel
          nativeID={labelId}
          className={labelClassName}
          required={required}
        >
          {label}
        </FormLabel>
      ) : null}
      <FormControl className={controlClassName}>{children}</FormControl>
      <FormDescription
        nativeID={descriptionId}
        className={descriptionClassName}
      >
        {description}
      </FormDescription>
      <FormMessage
        nativeID={messageId}
        className={messageClassName}
      >
        {error}
      </FormMessage>
    </View>
  );
}

export { FormControl, FormDescription, FormField, FormLabel, FormMessage };
export type { FormFieldProps, FormLabelProps };
