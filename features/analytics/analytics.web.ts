import { getFirebaseApp } from "@/lib/firebase";

import type { Analytics, AnalyticsParams } from "./types";

import {
  type Analytics as FirebaseAnalytics,
  logEvent as firebaseLogEvent,
  setUserId as firebaseSetUserId,
  setUserProperties as firebaseSetUserProperties,
  getAnalytics,
  isSupported,
} from "firebase/analytics";

let instancePromise: Promise<FirebaseAnalytics | null> | null = null;

function resolveAnalytics(): Promise<FirebaseAnalytics | null> {
  if (!process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID) {
    return Promise.resolve(null);
  }
  if (!instancePromise) {
    instancePromise = isSupported()
      .then((supported) => (supported ? getAnalytics(getFirebaseApp()) : null))
      .catch(() => null);
  }
  return instancePromise;
}

const analytics: Analytics = {
  logEvent(name, params) {
    void resolveAnalytics().then((instance) => {
      if (instance) firebaseLogEvent(instance, name, params as AnalyticsParams);
    });
  },
  logScreenView(screenName, screenClass) {
    this.logEvent("screen_view", {
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  },
  setUserId(userId) {
    void resolveAnalytics().then((instance) => {
      if (instance) firebaseSetUserId(instance, userId);
    });
  },
  setUserProperties(properties) {
    void resolveAnalytics().then((instance) => {
      if (instance) firebaseSetUserProperties(instance, properties);
    });
  },
};

export { analytics };
