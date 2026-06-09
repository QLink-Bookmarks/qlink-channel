import * as React from "react";
import { Platform } from "react-native";

import { useRegisterDeviceMutation } from "../mutations";

import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

function resolveProjectId(): string | undefined {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    (Constants.easConfig as { projectId?: string } | undefined)?.projectId
  );
}

function usePushNotifications() {
  const { mutate: registerDevice } = useRegisterDeviceMutation();
  const registeredTokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    async function setup() {
      if (!Device.isDevice) {
        console.warn("[push] Push notifications require a physical device.");
        return;
      }

      try {
        // We do NOT request notification permission here on purpose.
        // The token + data-only push receive path works without it; the user
        // is asked for permission later in onboarding (when we start showing
        // visible notifications).
        if (Platform.OS === "android") {
          await Notifications.setNotificationChannelAsync("default", {
            name: "default",
            importance: Notifications.AndroidImportance.DEFAULT,
          });
        }

        const projectId = resolveProjectId();
        const tokenResponse = await Notifications.getExpoPushTokenAsync(
          projectId ? { projectId } : undefined,
        );
        const token = tokenResponse.data;

        if (cancelled) return;

        console.log("[push] Expo push token:", token);

        if (registeredTokenRef.current !== token) {
          registeredTokenRef.current = token;
          registerDevice(
            { platform: "NATIVE", token },
            {
              onSuccess: (res) => console.log("[push] device registered:", res?.data?.id ?? res),
              onError: (err) => console.error("[push] device register failed:", err),
            },
          );
        }
      } catch (error) {
        console.error("[push] setup failed:", error);
      }
    }

    void setup();

    const receivedSub = Notifications.addNotificationReceivedListener((notification) => {
      console.log("[push] notification received:", notification);
    });
    const responseSub = Notifications.addNotificationResponseReceivedListener((response) => {
      console.log("[push] notification response:", response);
    });

    return () => {
      cancelled = true;
      receivedSub.remove();
      responseSub.remove();
    };
  }, [registerDevice]);
}

export { usePushNotifications };
