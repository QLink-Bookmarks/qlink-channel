/* eslint-disable */
// Firebase Cloud Messaging service worker for background notifications.
// Firebase web config is passed via query string at registration time so the
// same SW file works across dev/staging/prod environments.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

const params = new URLSearchParams(self.location.search);
const configParam = params.get("firebaseConfig");

if (!configParam) {
  console.error("[firebase-messaging-sw.js] Missing firebaseConfig query param.");
} else {
  try {
    const firebaseConfig = JSON.parse(configParam);
    firebase.initializeApp(firebaseConfig);

    const messaging = firebase.messaging();

    messaging.onBackgroundMessage((payload) => {
      console.log("[firebase-messaging-sw.js] Background message received:", payload);
      // FCM auto-displays "notification"-type messages; only build one ourselves
      // for data-only payloads so we never show a duplicate.
      if (payload.notification) return;
      const data = payload.data || {};
      const title = data.title || "큐링크";
      const body = data.message || data.body || "";
      if (!data.title && !body) return;
      self.registration.showNotification(title, {
        body,
        icon: "/web_favicon.png",
        data,
      });
    });
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to initialize Firebase:", error);
  }
}
