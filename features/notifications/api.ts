import { api } from "@/lib/api-client";

import type { PutDeviceRequest, PutDeviceResponse } from "./types";

async function registerDevice(payload: PutDeviceRequest) {
  return api.put<PutDeviceResponse, PutDeviceRequest>("/api/devices", payload);
}

export { registerDevice };
