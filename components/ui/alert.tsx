import * as React from "react";
import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import type { LucideIcon } from "lucide-react-native";

type AlertVariant = "default" | "info" | "warning" | "success" | "danger" | "hint" | "destructive";

const alertVariantClasses: Record<AlertVariant, string> = {
  default: "border-border bg-card",
  info: "border-primary/20 bg-primary/10",
  warning: "border-warning/20 bg-warning/10",
  success: "border-success/20 bg-success/10",
  danger: "border-destructive/20 bg-destructive/10",
  hint: "border-border-soft bg-surface-elevated",
  destructive: "border-destructive/20 bg-destructive/10",
};

const alertIconClasses: Record<AlertVariant, string> = {
  default: "text-foreground",
  info: "text-primary",
  warning: "text-warning",
  success: "text-success",
  danger: "text-destructive",
  hint: "text-muted-foreground",
  destructive: "text-destructive",
};

function Alert({
  className,
  variant = "default",
  children,
  icon,
  iconClassName,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> & {
    icon: LucideIcon;
    variant?: AlertVariant;
    iconClassName?: string;
  }) {
  const isDestructive = variant === "destructive" || variant === "danger";
  return (
    <TextClassContext.Provider
      value={cn("text-sm text-foreground", isDestructive && "text-destructive", className)}
    >
      <View
        role="alert"
        className={cn(
          "relative w-full rounded-xl border px-4 pb-2 pt-3.5",
          alertVariantClasses[variant],
          className,
        )}
        {...props}
      >
        <View className="absolute left-3.5 top-3">
          <Icon
            as={icon}
            className={cn("size-4", alertIconClasses[variant], iconClassName)}
          />
        </View>
        {children}
      </View>
    </TextClassContext.Provider>
  );
}

function AlertTitle({ className, ...props }: React.ComponentProps<typeof Text>) {
  return (
    <Text
      className={cn("mb-1 ml-0.5 min-h-4 pl-6 font-medium leading-none tracking-tight", className)}
      {...props}
    />
  );
}

function AlertDescription({ className, ...props }: React.ComponentProps<typeof Text>) {
  const textClass = React.useContext(TextClassContext);
  return (
    <Text
      className={cn(
        "ml-0.5 pb-1.5 pl-6 text-sm leading-relaxed text-muted-foreground",
        textClass?.includes("text-destructive") && "text-destructive/90",
        className,
      )}
      {...props}
    />
  );
}

export { Alert, AlertDescription, AlertTitle };
