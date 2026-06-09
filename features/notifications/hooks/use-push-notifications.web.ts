import * as React from "react";

import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY, getFirebaseApp } from "@/lib/firebase";

import { useRegisterDeviceMutation } from "../mutations";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

type PushNotificationsState = {
  primerOpen: boolean;
  accept: () => void;
  dismiss: () => void;
};

function buildServiceWorkerUrl() {
  const config = encodeURIComponent(JSON.stringify(FIREBASE_CONFIG));
  return `/firebase-messaging-sw.js?firebaseConfig=${config}`;
}

function isSupported() {
  return typeof window !== "undefined" && "serviceWorker" in navigator && "Notification" in window;
}

function usePushNotifications(): PushNotificationsState {
  const { mutate: registerDevice } = useRegisterDeviceMutation();
  const registeredTokenRef = React.useRef<string | null>(null);
  const unsubscribeRef = React.useRef<(() => void) | null>(null);
  const cancelledRef = React.useRef(false);
  const [primerOpen, setPrimerOpen] = React.useState(false);

  const runFcmSetup = React.useCallback(async () => {
    try {
      const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl());
      const messaging = getMessaging(getFirebaseApp());

      const token = await getToken(messaging, {
        vapidKey: FIREBASE_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (cancelledRef.current) return;

      if (!token) {
        console.warn("[push] FCM returned no token.");
        return;
      }

      console.log("[push] FCM device token:", token);

      if (registeredTokenRef.current !== token) {
        registeredTokenRef.current = token;
        registerDevice(
          { platform: "WEB", token },
          {
            onSuccess: (res) => console.log("[push] device registered:", res?.data?.id ?? res),
            onError: (err) => console.error("[push] device register failed:", err),
          },
        );
      }

      const off = onMessage(messaging, (payload) => {
        console.log("[push] foreground message:", payload);
      });
      unsubscribeRef.current = off;
    } catch (error) {
      console.error("[push] setup failed:", error);
    }
  }, [registerDevice]);

  React.useEffect(() => {
    cancelledRef.current = false;

    if (!isSupported()) {
      console.warn("[push] This browser does not support web push.");
      return;
    }
    if (!FIREBASE_VAPID_KEY) {
      console.warn("[push] EXPO_PUBLIC_FIREBASE_VAPID_KEY is not set; skipping FCM setup.");
      return;
    }

    if (Notification.permission === "granted") {
      void runFcmSetup();
    } else if (Notification.permission === "default") {
      setPrimerOpen(true);
    }
    // "denied" → silently noop; user can re-enable via browser site settings.

    return () => {
      cancelledRef.current = true;
      unsubscribeRef.current?.();
      unsubscribeRef.current = null;
    };
  }, [runFcmSetup]);

  const accept = React.useCallback(() => {
    setPrimerOpen(false);
    // requestPermission must be called from a user gesture — this handler is
    // invoked from the "확인" button's onPress.
    void (async () => {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        void runFcmSetup();
      } else {
        console.warn("[push] Notification permission not granted:", permission);
      }
    })();
  }, [runFcmSetup]);

  const dismiss = React.useCallback(() => {
    setPrimerOpen(false);
  }, []);

  return { primerOpen, accept, dismiss };
}

export type { PushNotificationsState };
export { usePushNotifications };
