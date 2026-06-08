// Native fallback. Firebase web SDK is only loaded on web via firebase.web.ts.
function getFirebaseApp(): never {
  throw new Error("Firebase is only available on web.");
}

const FIREBASE_VAPID_KEY = "";

export { FIREBASE_VAPID_KEY, getFirebaseApp };
