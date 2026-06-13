import type { ApiEnvelope } from "@/features/links/types";

type AuthPlatform = "WEB" | "NATIVE";

type SignInRequest = {
  provider: string;
  token: string;
  platform: AuthPlatform;
};

type AuthTokenResponseData = {
  accessToken: string;
  refreshToken: string;
};

type AuthTokenResponse = ApiEnvelope<AuthTokenResponseData>;

type NativeRefreshTokenRequest = {
  refreshToken?: string | null;
};

type SignOutRequest = {
  refreshToken?: string | null;
};

type SignOutResponse = ApiEnvelope<null>;

export type {
  AuthPlatform,
  AuthTokenResponse,
  AuthTokenResponseData,
  NativeRefreshTokenRequest,
  SignInRequest,
  SignOutRequest,
  SignOutResponse,
};
