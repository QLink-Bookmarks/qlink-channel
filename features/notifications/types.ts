import type { ApiEnvelope } from "@/features/links/types";

type DevicePlatform = "WEB" | "NATIVE";
type NotificationContext = "TODO";
type NotificationOrder = "latest" | "earliest" | string;

type PutDeviceRequest = {
  platform: DevicePlatform;
  token: string;
};

type PutDeviceResponseData = {
  id: number;
};

type PutDeviceResponse = ApiEnvelope<PutDeviceResponseData>;

type NotificationListItem = {
  id: number;
  title: string;
  message: string;
  firedAt: string;
  readAt?: string | null;
  context: NotificationContext;
  contextId: number;
};

type NotificationScrollResponse = {
  isEmpty: boolean;
  contents: NotificationListItem[];
  nextCursor: string | null;
  hasNext: boolean;
};

type GetNotificationsParams = {
  query?: string;
  order?: NotificationOrder;
  cursor?: string;
  size?: number;
};

type GetNotificationsResponse = ApiEnvelope<NotificationScrollResponse>;

export type {
  DevicePlatform,
  GetNotificationsParams,
  GetNotificationsResponse,
  NotificationContext,
  NotificationListItem,
  NotificationOrder,
  NotificationScrollResponse,
  PutDeviceRequest,
  PutDeviceResponse,
  PutDeviceResponseData,
};
