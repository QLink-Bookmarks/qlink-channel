import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Text } from "@/components/ui/text";
import * as DialogPrimitive from "@rn-primitives/dialog";

import { usePushNotifications } from "../hooks/use-push-notifications";

function PushNotificationsBridge() {
  const { primerOpen, accept, dismiss } = usePushNotifications();

  return (
    <DialogPrimitive.Root open={primerOpen}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay
          // No backdrop; pointer-events-none so the rest of the page stays interactive.
          className="pointer-events-none fixed bottom-0 left-0 right-0 top-0 z-50 flex items-center justify-center bg-transparent p-2"
        >
          <DialogPrimitive.Content
            className="pointer-events-auto z-50 mx-auto flex w-full max-w-[calc(100%-2rem)] flex-col gap-4 rounded-lg border border-border bg-background p-6 shadow-lg shadow-black/5 sm:max-w-md"
            onInteractOutside={(event) => event.preventDefault()}
            onPointerDownOutside={(event) => event.preventDefault()}
            onEscapeKeyDown={(event) => event.preventDefault()}
          >
            <View className="flex flex-col gap-2">
              <DialogPrimitive.Title className="text-lg font-semibold text-foreground">
                알림을 활성화 하시겠어요?
              </DialogPrimitive.Title>
              <DialogPrimitive.Description className="text-sm text-muted-foreground">
                지금이 아니더라도 URL 입력창에 🔒를 눌러서 활성화 할 수 있어요
              </DialogPrimitive.Description>
            </View>
            <View className="flex flex-row justify-end gap-2">
              <Button
                variant="outline"
                onPress={dismiss}
              >
                <Text>취소</Text>
              </Button>
              <Button onPress={accept}>
                <Text>확인</Text>
              </Button>
            </View>
          </DialogPrimitive.Content>
        </DialogPrimitive.Overlay>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

export { PushNotificationsBridge };
