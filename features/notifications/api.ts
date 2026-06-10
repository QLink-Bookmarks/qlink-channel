import { api } from "@/lib/api-client";

import type {
  GetNotificationsParams,
  GetNotificationsResponse,
  PutDeviceRequest,
  PutDeviceResponse,
} from "./types";

async function getNotifications(params: GetNotificationsParams = {}) {
  return api.get<GetNotificationsResponse>("/api/notifications", { params });
}

async function registerDevice(payload: PutDeviceRequest) {
  return api.put<PutDeviceResponse, PutDeviceRequest>("/api/devices", payload);
}

export { getNotifications, registerDevice };
