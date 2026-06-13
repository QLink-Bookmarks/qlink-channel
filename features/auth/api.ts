import { api } from "@/lib/api-client";

import type { AuthTokenResponse, NativeRefreshTokenRequest, SignInRequest } from "./types";

async function signIn(payload: SignInRequest) {
  return api.post<AuthTokenResponse, SignInRequest>("/api/auth/sign", payload);
}

async function refreshTokenWeb() {
  return api.post<AuthTokenResponse>("/api/auth/token/refresh/web");
}

async function refreshTokenNative(payload: NativeRefreshTokenRequest) {
  return api.post<AuthTokenResponse, NativeRefreshTokenRequest>(
    "/api/auth/token/refresh/native",
    payload,
  );
}

export { refreshTokenNative, refreshTokenWeb, signIn };
