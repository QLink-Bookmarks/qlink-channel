/* eslint-disable */
// Firebase Cloud Messaging service worker for background notifications.
// Firebase web config is safe to expose publicly.
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js");

firebase.initializeApp({
  apiKey: "AIzaSyDolBXJnlvPUUAWq-D8ivXwYNd367TBxEM",
  authDomain: "qlink-73a09.firebaseapp.com",
  projectId: "qlink-73a09",
  storageBucket: "qlink-73a09.firebasestorage.app",
  messagingSenderId: "942900946985",
  appId: "1:942900946985:web:081a69729e0f469385d438",
  measurementId: "G-5F91CQKJ1V",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] Background message received:", payload);
});
