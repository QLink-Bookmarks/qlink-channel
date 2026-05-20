import { View } from "react-native";

import { Text, TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";

import { type VariantProps, cva } from "class-variance-authority";

const cardVariants = cva("flex flex-col rounded-2xl border bg-card shadow-qlink-card", {
  variants: {
    variant: {
      default: "border-border",
      flat: "border-transparent shadow-none",
      elevated: "border-border shadow-qlink-md",
      interactive:
        "border-border active:border-primary active:shadow-qlink-md web:hover:border-primary web:hover:shadow-qlink-md",
      outlined: "border-border bg-transparent shadow-none",
    },
    density: {
      compact: "gap-3 py-4",
      default: "gap-6 py-6",
    },
  },
  defaultVariants: {
    variant: "default",
    density: "default",
  },
});

function Card({
  className,
  variant,
  density,
  ...props
}: React.ComponentProps<typeof View> &
  React.RefAttributes<View> &
  VariantProps<typeof cardVariants>) {
  return (
    <TextClassContext.Provider value="text-card-foreground">
      <View
        className={cn(cardVariants({ variant, density }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function CardHeader({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return (
    <View
      className={cn("flex flex-col gap-1.5 px-6", className)}
      {...props}
    />
  );
}

function CardTitle({
  className,
  ref,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      ref={ref}
      role="heading"
      aria-level={3}
      className={cn("font-semibold leading-none", className)}
      {...props}
    />
  );
}

function CardDescription({
  className,
  ...props
}: React.ComponentProps<typeof Text> & React.RefAttributes<typeof Text>) {
  return (
    <Text
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function CardContent({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return (
    <View
      className={cn("px-6", className)}
      {...props}
    />
  );
}

function CardFooter({
  className,
  ...props
}: React.ComponentProps<typeof View> & React.RefAttributes<View>) {
  return (
    <View
      className={cn("flex flex-row items-center px-6", className)}
      {...props}
    />
  );
}

export { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle, cardVariants };
