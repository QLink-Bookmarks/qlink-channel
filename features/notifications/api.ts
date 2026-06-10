import { api } from "@/lib/api-client";

import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  PutDeviceRequest,
  PutDeviceResponse,
  ReadNotificationResponse,
} from "./types";

async function getNotifications(params: GetNotificationsParams = {}) {
  return api.get<GetNotificationsResponse>("/api/notifications", { params });
}

async function registerDevice(payload: PutDeviceRequest) {
  return api.put<PutDeviceResponse, PutDeviceRequest>("/api/devices", payload);
}

async function readNotification(notificationId: number | string) {
  return api.put<ReadNotificationResponse>(`/api/notifications/${notificationId}/read`);
}

export { getNotifications, readNotification, registerDevice };
