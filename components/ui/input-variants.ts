import { type VariantProps, cva } from "class-variance-authority";

const inputVariants = cva(
  "flex w-full min-w-0 flex-row items-center border border-input text-foreground shadow-sm shadow-black/5 dark:bg-input/30",
  {
    variants: {
      variant: {
        default: "rounded-md bg-card dark:bg-card",
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

type InputVariantProps = VariantProps<typeof inputVariants>;

export { inputVariants };
export type { InputVariantProps };
