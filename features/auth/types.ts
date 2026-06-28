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

type ConnectAuthProviderRequest = {
  provider: string;
  token: string;
  platform: AuthPlatform;
};

type ConnectAuthProviderResponse = ApiEnvelope<{ id: number } | null>;

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
  ConnectAuthProviderRequest,
  ConnectAuthProviderResponse,
  NativeRefreshTokenRequest,
  SignInRequest,
  SignOutRequest,
  SignOutResponse,
};
