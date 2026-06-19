import * as React from "react";
import { AppState, Linking } from "react-native";

import * as Notifications from "expo-notifications";

type DeviceNotificationStatus = {
  // null while the permission is still being read.
  isEnabled: boolean | null;
  enable: () => void;
};

function useDeviceNotificationStatus(): DeviceNotificationStatus {
  const [isEnabled, setIsEnabled] = React.useState<boolean | null>(null);

  const refresh = React.useCallback(async () => {
    const { granted } = await Notifications.getPermissionsAsync();
    setIsEnabled(granted);
  }, []);

  React.useEffect(() => {
    void refresh();
    // Permission can change in the system Settings app while we're backgrounded,
    // so re-read it every time the app returns to the foreground.
    const subscription = AppState.addEventListener("change", (state) => {
      if (state === "active") {
        void refresh();
      }
    });
    return () => subscription.remove();
  }, [refresh]);

  const enable = React.useCallback(() => {
    void (async () => {
      const current = await Notifications.getPermissionsAsync();
      if (current.granted) {
        setIsEnabled(true);
        return;
      }
      // First time (e.g. onboarding skipped): show the OS prompt while we still can.
      if (current.canAskAgain) {
        const next = await Notifications.requestPermissionsAsync();
        setIsEnabled(next.granted);
        if (next.granted) {
          return;
        }
      }
      // Already denied and the OS won't prompt again — send them to system settings.
      void Linking.openSettings();
    })();
  }, []);

  return { isEnabled, enable };
}

export type { DeviceNotificationStatus };
export { useDeviceNotificationStatus };
