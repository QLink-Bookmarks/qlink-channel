import {
  getAnalytics,
  logEvent,
  logScreenView,
  setUserId,
  setUserProperty,
} from "@react-native-firebase/analytics";
import { getApp } from "@react-native-firebase/app";

import type { Analytics, AnalyticsParams } from "./types";

const instance = getAnalytics(getApp());

const analytics: Analytics = {
  logEvent(name, params) {
    void logEvent(instance, name, params as AnalyticsParams);
  },
  logScreenView(screenName, screenClass) {
    void logScreenView(instance, {
      screen_name: screenName,
      screen_class: screenClass ?? screenName,
    });
  },
  setUserId(userId) {
    void setUserId(instance, userId);
  },
  setUserProperties(properties) {
    for (const [key, value] of Object.entries(properties)) {
      void setUserProperty(instance, key, value);
    }
  },
};

export { analytics };
