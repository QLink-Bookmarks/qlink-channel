import * as React from "react";
import { View } from "react-native";

import { cn } from "@/lib/utils";
import * as AvatarPrimitive from "@rn-primitives/avatar";

import { type VariantProps, cva } from "class-variance-authority";

const avatarVariants = cva("relative flex shrink-0 overflow-hidden rounded-full", {
  variants: {
    size: {
      xs: "size-6",
      sm: "size-8",
      md: "size-10",
      lg: "size-12",
      xl: "size-16",
    },
  },
  defaultVariants: {
    size: "sm",
  },
});

function Avatar({
  className,
  size,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Root> & VariantProps<typeof avatarVariants>) {
  return (
    <AvatarPrimitive.Root
      className={cn(avatarVariants({ size }), className)}
      {...props}
    />
  );
}

function AvatarImage({
  className,
  source,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Image>) {
  const uri =
    source && typeof source === "object" && !Array.isArray(source) && "uri" in source
      ? (source as { uri?: string }).uri
      : undefined;
  const stableSource = React.useMemo(
    () => (uri ? { uri } : source),
    // Stabilize on the uri string so the primitive's source-keyed effect doesn't refire on every parent render.
    [uri, source],
  );
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      source={stableSource}
      {...props}
    />
  );
}

function AvatarFallback({
  className,
  ...props
}: React.ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full flex-row items-center justify-center rounded-full bg-muted",
        className,
      )}
      {...props}
    />
  );
}

function AvatarGroup({
  className,
  children,
  ...props
}: React.ComponentProps<typeof View> & { children?: React.ReactNode }) {
  return (
    <View
      className={cn("flex flex-row -space-x-2", className)}
      {...props}
    >
      {children}
    </View>
  );
}

export { Avatar, AvatarFallback, AvatarGroup, AvatarImage, avatarVariants };
