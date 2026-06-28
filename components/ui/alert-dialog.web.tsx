import * as React from "react";
import { View, type ViewProps } from "react-native";

import { type ButtonProps, buttonTextVariants, buttonVariants } from "@/components/ui/button";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as DialogPrimitive from "@rn-primitives/dialog";

const AlertDialog = DialogPrimitive.Root;

const AlertDialogTrigger = DialogPrimitive.Trigger;

const AlertDialogPortal = DialogPrimitive.Portal;

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof DialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Overlay
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2 animate-in fade-in-0 [&>*]:cursor-auto",
        className,
      )}
      {...props}
    >
      <>{children}</>
    </DialogPrimitive.Overlay>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  children,
  onInteractOutside,
  onPointerDownOutside,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Content> & {
  portalHost?: string;
}) {
  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        <DialogPrimitive.Content
          className={cn(
            "z-50 mx-auto flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border border-border bg-background p-6 shadow-lg shadow-black/5 duration-200 animate-in fade-in-0 zoom-in-95 sm:max-w-lg",
            className,
          )}
          onInteractOutside={(event) => {
            event.preventDefault();
            onInteractOutside?.(event);
          }}
          onPointerDownOutside={(event) => {
            event.preventDefault();
            onPointerDownOutside?.(event);
          }}
          {...props}
        >
          <>{children}</>
        </DialogPrimitive.Content>
      </AlertDialogOverlay>
    </AlertDialogPortal>
  );
}

function AlertDialogHeader({ className, ...props }: ViewProps) {
  return (
    <TextClassContext.Provider value="text-center sm:text-left">
      <View
        className={cn("flex flex-col gap-2", className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogFooter({ className, ...props }: ViewProps) {
  return (
    <View
      className={cn("flex flex-col-reverse gap-2 sm:flex-row sm:justify-end", className)}
      {...props}
    />
  );
}

function AlertDialogTitle({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Title>) {
  return (
    <DialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Description>) {
  return (
    <DialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  variant = "default",
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close> & {
  variant?: ButtonProps["variant"];
}) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant })}>
      <DialogPrimitive.Close
        className={cn(buttonVariants({ variant }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({
  className,
  ...props
}: React.ComponentProps<typeof DialogPrimitive.Close>) {
  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
      <DialogPrimitive.Close
        className={cn(buttonVariants({ variant: "outline" }), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

export {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogOverlay,
  AlertDialogPortal,
  AlertDialogTitle,
  AlertDialogTrigger,
};
