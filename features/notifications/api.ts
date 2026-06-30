import { api } from "@/lib/api-client";

import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  GetUnreadNotificationCountResponse,
  PutDeviceRequest,
  PutDeviceResponse,
  ReadNotificationResponse,
} from "./types";

async function getNotifications(params: GetNotificationsParams = {}) {
  return api.get<GetNotificationsResponse>("/api/notifications", { params });
}

async function getUnreadNotificationCount() {
  return api.get<GetUnreadNotificationCountResponse>("/api/notifications/unread");
}

async function registerDevice(payload: PutDeviceRequest) {
  return api.put<PutDeviceResponse, PutDeviceRequest>("/api/devices", payload);
}

async function readNotification(notificationId: number | string) {
  return api.put<ReadNotificationResponse>(`/api/notifications/${notificationId}/read`);
}

export { getNotifications, getUnreadNotificationCount, readNotification, registerDevice };
