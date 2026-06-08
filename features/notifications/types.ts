import type { ApiEnvelope } from "@/features/links/types";

type DevicePlatform = "WEB" | "NATIVE";

type PutDeviceRequest = {
  platform: DevicePlatform;
  token: string;
};

type PutDeviceResponseData = {
  id: number;
};

type PutDeviceResponse = ApiEnvelope<PutDeviceResponseData>;

export type { DevicePlatform, PutDeviceRequest, PutDeviceResponse, PutDeviceResponseData };
