import * as React from "react";
import { Platform, View, type ViewProps } from "react-native";
import { FadeIn, FadeOut } from "react-native-reanimated";
import { FullWindowOverlay as RNFullWindowOverlay } from "react-native-screens";

import { buttonTextVariants, buttonVariants } from "@/components/ui/button";
import { NativeOnlyAnimatedView } from "@/components/ui/native-only-animated-view";
import { TextClassContext } from "@/components/ui/text";
import { cn } from "@/lib/utils";
import * as RadixAlertDialog from "@radix-ui/react-alert-dialog";
import * as AlertDialogPrimitive from "@rn-primitives/alert-dialog";

const AlertDialog = AlertDialogPrimitive.Root;

const AlertDialogTrigger = AlertDialogPrimitive.Trigger;

const AlertDialogPortal = AlertDialogPrimitive.Portal;

const FullWindowOverlay = Platform.OS === "ios" ? RNFullWindowOverlay : React.Fragment;

const isStorybookVite = typeof process !== "undefined" && process.env.STORYBOOK_VITE === "true";

function AlertDialogOverlay({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AlertDialogPrimitive.Overlay>, "asChild"> & {
  children?: React.ReactNode;
}) {
  const classNames = cn(
    "absolute bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-black/50 p-2",
    Platform.select({
      web: "animate-in fade-in-0 fixed",
    }),
    className,
  );

  if (isStorybookVite) {
    return (
      <RadixAlertDialog.Overlay
        className={classNames}
        {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Overlay>)}
      >
        {children}
      </RadixAlertDialog.Overlay>
    );
  }

  return (
    <FullWindowOverlay>
      <AlertDialogPrimitive.Overlay
        className={classNames}
        {...props}
      >
        <NativeOnlyAnimatedView
          entering={FadeIn.duration(200).delay(50)}
          exiting={FadeOut.duration(150)}
        >
          <>{children}</>
        </NativeOnlyAnimatedView>
      </AlertDialogPrimitive.Overlay>
    </FullWindowOverlay>
  );
}

function AlertDialogContent({
  className,
  portalHost,
  children,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Content> & {
  portalHost?: string;
}) {
  const classNames = cn(
    "bg-background border-border z-50 flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border p-6 shadow-lg shadow-black/5 sm:max-w-lg",
    Platform.select({
      web: "animate-in fade-in-0 zoom-in-95 duration-200",
    }),
    className,
  );

  return (
    <AlertDialogPortal hostName={portalHost}>
      <AlertDialogOverlay>
        {isStorybookVite ? (
          <RadixAlertDialog.Content
            className={classNames}
            {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Content>)}
          >
            {children}
          </RadixAlertDialog.Content>
        ) : (
          <AlertDialogPrimitive.Content
            className={classNames}
            {...props}
          >
            {children}
          </AlertDialogPrimitive.Content>
        )}
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
}: React.ComponentProps<typeof AlertDialogPrimitive.Title>) {
  if (isStorybookVite) {
    return (
      <RadixAlertDialog.Title
        className={cn("text-lg font-semibold text-foreground", className)}
        {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Title>)}
      />
    );
  }

  return (
    <AlertDialogPrimitive.Title
      className={cn("text-lg font-semibold text-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogDescription({
  className,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Description>) {
  if (isStorybookVite) {
    return (
      <RadixAlertDialog.Description
        className={cn("text-sm text-muted-foreground", className)}
        {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Description>)}
      />
    );
  }

  return (
    <AlertDialogPrimitive.Description
      className={cn("text-sm text-muted-foreground", className)}
      {...props}
    />
  );
}

function AlertDialogAction({
  className,
  onPress,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Action>) {
  if (isStorybookVite) {
    return (
      <TextClassContext.Provider value={buttonTextVariants({ className })}>
        <RadixAlertDialog.Action
          className={cn(buttonVariants(), className)}
          onClick={
            onPress
              ? (event) => onPress(event as unknown as Parameters<NonNullable<typeof onPress>>[0])
              : undefined
          }
          {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Action>)}
        />
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value={buttonTextVariants({ className })}>
      <AlertDialogPrimitive.Action
        className={cn(buttonVariants(), className)}
        {...props}
      />
    </TextClassContext.Provider>
  );
}

function AlertDialogCancel({
  className,
  onPress,
  ...props
}: React.ComponentProps<typeof AlertDialogPrimitive.Cancel>) {
  if (isStorybookVite) {
    return (
      <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
        <RadixAlertDialog.Cancel
          className={cn(buttonVariants({ variant: "outline" }), className)}
          onClick={
            onPress
              ? (event) => onPress(event as unknown as Parameters<NonNullable<typeof onPress>>[0])
              : undefined
          }
          {...(props as React.ComponentPropsWithoutRef<typeof RadixAlertDialog.Cancel>)}
        />
      </TextClassContext.Provider>
    );
  }

  return (
    <TextClassContext.Provider value={buttonTextVariants({ className, variant: "outline" })}>
      <AlertDialogPrimitive.Cancel
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
