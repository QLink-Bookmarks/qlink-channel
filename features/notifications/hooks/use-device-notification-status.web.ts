import * as React from "react";

type DeviceNotificationStatus = {
  // null while the permission is still being read.
  isEnabled: boolean | null;
  enable: () => void;
};

function isSupported() {
  return typeof window !== "undefined" && "Notification" in window;
}

function useDeviceNotificationStatus(): DeviceNotificationStatus {
  const [isEnabled, setIsEnabled] = React.useState<boolean | null>(null);

  const refresh = React.useCallback(() => {
    if (!isSupported()) {
      // No web push support → nothing to turn on, so don't nag the user.
      setIsEnabled(true);
      return;
    }
    setIsEnabled(Notification.permission === "granted");
  }, []);

  React.useEffect(() => {
    refresh();
    if (!isSupported()) {
      return;
    }
    // The user may flip permission via the browser's site settings, so re-read
    // whenever the tab regains focus.
    const handleVisibility = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("focus", refresh);
    return () => {
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("focus", refresh);
    };
  }, [refresh]);

  const enable = React.useCallback(() => {
    if (!isSupported()) {
      return;
    }
    // requestPermission only prompts when status is "default"; once "denied" the
    // browser silently no-ops and the user must re-enable via the address-bar lock.
    void Notification.requestPermission().then((permission) => {
      setIsEnabled(permission === "granted");
    });
  }, []);

  return { isEnabled, enable };
}

export type { DeviceNotificationStatus };
export { useDeviceNotificationStatus };
