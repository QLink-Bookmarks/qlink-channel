import * as React from "react";

import { FIREBASE_CONFIG, FIREBASE_VAPID_KEY, getFirebaseApp } from "@/lib/firebase";

import { useRegisterDeviceMutation } from "../mutations";

import { getMessaging, getToken, onMessage } from "firebase/messaging";

function buildServiceWorkerUrl() {
  const config = encodeURIComponent(JSON.stringify(FIREBASE_CONFIG));
  return `/firebase-messaging-sw.js?firebaseConfig=${config}`;
}

function usePushNotifications() {
  const { mutate: registerDevice } = useRegisterDeviceMutation();
  const registeredTokenRef = React.useRef<string | null>(null);

  React.useEffect(() => {
    let cancelled = false;
    let unsubscribe: (() => void) | undefined;

    async function setup() {
      if (typeof window === "undefined") return;
      if (!("serviceWorker" in navigator) || !("Notification" in window)) {
        console.warn("[push] This browser does not support web push.");
        return;
      }
      if (!FIREBASE_VAPID_KEY) {
        console.warn("[push] EXPO_PUBLIC_FIREBASE_VAPID_KEY is not set; skipping FCM setup.");
        return;
      }

      try {
        const permission =
          Notification.permission === "default"
            ? await Notification.requestPermission()
            : Notification.permission;
        if (permission !== "granted") {
          console.warn("[push] Notification permission not granted:", permission);
          return;
        }

        const registration = await navigator.serviceWorker.register(buildServiceWorkerUrl());
        const messaging = getMessaging(getFirebaseApp());

        const token = await getToken(messaging, {
          vapidKey: FIREBASE_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (cancelled) return;

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
        unsubscribe = off;
      } catch (error) {
        console.error("[push] setup failed:", error);
      }
    }

    void setup();

    return () => {
      cancelled = true;
      unsubscribe?.();
    };
  }, [registerDevice]);
}

export { usePushNotifications };
