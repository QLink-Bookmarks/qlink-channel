import { api } from "@/lib/api-client";

import type {
  DeleteDeviceResponse,
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

// Detach this device's push token from the calling account. authToken is passed
// explicitly because this runs around sign-out, when the auth store is cleared.
async function deleteDevice(token: string, authToken: string) {
  return api.delete<DeleteDeviceResponse>(`/api/devices/${encodeURIComponent(token)}`, {
    authToken,
  });
}

async function readNotification(notificationId: number | string) {
  return api.put<ReadNotificationResponse>(`/api/notifications/${notificationId}/read`);
}

export {
  deleteDevice,
  getNotifications,
  getUnreadNotificationCount,
  readNotification,
  registerDevice,
};
