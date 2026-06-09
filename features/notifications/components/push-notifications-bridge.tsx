import { usePushNotifications } from "../hooks/use-push-notifications";

function PushNotificationsBridge() {
  usePushNotifications();
  return null;
}

export { PushNotificationsBridge };
