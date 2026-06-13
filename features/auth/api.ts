import { api } from "@/lib/api-client";

import type {
  AuthTokenResponse,
  NativeRefreshTokenRequest,
  SignInRequest,
  SignOutRequest,
  SignOutResponse,
} from "./types";

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

async function signOut(payload: SignOutRequest = {}) {
  return api.delete<SignOutResponse>("/api/auth/signout", { data: payload });
}

export { refreshTokenNative, refreshTokenWeb, signIn, signOut };
