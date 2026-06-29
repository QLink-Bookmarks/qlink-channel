import { usePushNotifications } from "../hooks/use-push-notifications";

// Runs FCM token registration only. The notification-enable prompt lives in the
// /agreements flow (and Settings), so there is no global primer modal here.
function PushNotificationsBridge() {
  usePushNotifications();
  return null;
}

export { PushNotificationsBridge };
