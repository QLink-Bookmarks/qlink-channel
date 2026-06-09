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
    });
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to initialize Firebase:", error);
  }
}
