import { deleteDevice } from "../api";
import { resolveProjectId } from "./resolve-project-id";

import * as Device from "expo-device";
import { getExpoPushTokenAsync } from "expo-notifications";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T | null> {
  return Promise.race([
    promise,
    new Promise<null>((resolve) => {
      setTimeout(() => resolve(null), ms);
    }),
  ]);
}

// Detach this device's push token from the account being signed out. The Expo
// token is device-fixed, so we re-fetch it (no auth needed) and DELETE it with
// the captured auth token. Best-effort and bounded — sign-out must never block
// on or revert because of this.
async function unregisterDevice(authToken: string): Promise<void> {
  if (!authToken || !Device.isDevice) {
    return;
  }
  try {
    const projectId = resolveProjectId();
    const tokenResponse = await withTimeout(
      getExpoPushTokenAsync(projectId ? { projectId } : undefined),
      4000,
    );
    const token = tokenResponse?.data;
    if (!token) {
      return;
    }
    await withTimeout(deleteDevice(token, authToken), 4000);
  } catch {
    // Best-effort cleanup; ignore failures.
  }
}

export { unregisterDevice };
