import { connectAuthProvider } from "../api";
import type { AuthPlatform } from "../types";
import type { SocialProvider } from "./provider-brand";

import { isAxiosError } from "axios";

type ConnectOutcome =
  | { kind: "connected"; provider: SocialProvider }
  | { kind: "error"; provider: SocialProvider; alreadyConnected: boolean };

const ALREADY_CONNECTED_CODE = "AUTH_409_0001";

// Send the social token to POST /api/auth/connection and map the result/error
// to a small outcome the UI can react to. Never throws.
async function connectWithToken(
  provider: SocialProvider,
  token: string,
  platform: AuthPlatform,
): Promise<ConnectOutcome> {
  try {
    const response = await connectAuthProvider({ provider, token, platform });
    if (response?.success) {
      return { kind: "connected", provider };
    }
    return {
      kind: "error",
      provider,
      alreadyConnected: response?.error?.code === ALREADY_CONNECTED_CODE,
    };
  } catch (error) {
    const code = isAxiosError(error)
      ? (error.response?.data as { error?: { code?: string } } | undefined)?.error?.code
      : undefined;
    return { kind: "error", provider, alreadyConnected: code === ALREADY_CONNECTED_CODE };
  }
}

export { connectWithToken };
export type { ConnectOutcome };
