import * as React from "react";
import { View } from "react-native";

import { Sheet } from "@/components/layout/sheet";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Text } from "@/components/ui/text";
import { useDisplaySettings } from "@/stores/display-settings";

type PickerOverlayMode = "wide" | "mobile";

type PickerOverlayProps = {
  mode: PickerOverlayMode;
  open: boolean;
  title: string;
  /** Optional inline message rendered between the picker and footer (e.g. validation hint). */
  hint?: React.ReactNode;
  cancelLabel?: string;
  confirmLabel?: string;
  confirmDisabled?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  children: React.ReactNode;
};

function PickerOverlay({
  mode,
  open,
  title,
  hint,
  cancelLabel = "취소",
  confirmLabel = "확인",
  confirmDisabled = false,
  onCancel,
  onConfirm,
  children,
}: PickerOverlayProps) {
  const theme = useDisplaySettings((state) => state.display.theme);
  const accent = useDisplaySettings((state) => state.display.accent);

  const body = (
    <View className="gap-4">
      <View className="-mx-1 border-b border-border" />
      <View className="px-1">{children}</View>
      {hint ? <View className="px-1">{hint}</View> : null}
      <View className="-mx-1 border-b border-border" />
      <View className="flex-row gap-3">
        <Button
          className="h-12 flex-1 rounded-2xl"
          variant="outline"
          onPress={onCancel}
        >
          <Text className="text-base font-semibold">{cancelLabel}</Text>
        </Button>
        <Button
          className="h-12 flex-1 rounded-2xl"
          disabled={confirmDisabled}
          onPress={onConfirm}
        >
          <Text className="text-base font-semibold">{confirmLabel}</Text>
        </Button>
      </View>
    </View>
  );

  if (mode === "wide") {
    return (
      <Dialog
        open={open}
        onOpenChange={(next) => {
          if (!next) onCancel();
        }}
      >
        <DialogContent className="max-w-sm gap-4 p-6">
          <DialogTitle className="text-xl font-bold text-foreground">{title}</DialogTitle>
          {body}
        </DialogContent>
      </Dialog>
    );
  }

  if (!open) {
    return null;
  }

  return (
    <Sheet
      open={open}
      fitContent
      accent={accent}
      mode={theme}
      onOpenChange={(next) => {
        if (!next) onCancel();
      }}
    >
      <View className="gap-3 px-1">
        <Text className="text-xl font-bold text-foreground">{title}</Text>
        {body}
      </View>
    </Sheet>
  );
}

export type { PickerOverlayMode, PickerOverlayProps };
export { PickerOverlay };
