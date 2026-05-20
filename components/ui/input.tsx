import { Platform, TextInput } from "react-native";

import { cn } from "@/lib/utils";

import { type VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full min-w-0 flex-row items-center border border-input text-foreground shadow-sm shadow-black/5 dark:bg-input/30",
  {
    variants: {
      variant: {
        default: "rounded-md bg-background",
        search: "rounded-full bg-card",
        pill: "rounded-full bg-surface-elevated",
        inline: "rounded-none border-0 bg-transparent shadow-none",
      },
      size: {
        sm: "h-9 px-3 py-1 text-sm",
        md: "h-10 px-3 py-1 text-base leading-5",
        lg: "h-12 px-4 py-2 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "md",
    },
  },
);

function Input({
  className,
  variant,
  size,
  ...props
}: React.ComponentProps<typeof TextInput> &
  React.RefAttributes<TextInput> &
  VariantProps<typeof inputVariants>) {
  return (
    <TextInput
      className={cn(
        inputVariants({ variant, size }),
        props.editable === false &&
          cn(
            "opacity-50",
            Platform.select({
              web: "disabled:pointer-events-none disabled:cursor-not-allowed",
            }),
          ),
        Platform.select({
          web: cn(
            "outline-none transition-[color,box-shadow] selection:bg-primary selection:text-primary-foreground placeholder:text-muted-foreground md:text-sm",
            "focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50",
            "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
          ),
          native: "placeholder:text-muted-foreground/50",
        }),
        className,
      )}
      {...props}
    />
  );
}

export { Input };
