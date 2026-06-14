import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";

import { signIn } from "../api";
import { beginOauthState } from "../lib/oauth-state";

const NAVER_AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";
const NAVER_TOKEN_URL = "https://nid.naver.com/oauth2.0/token";

function getRedirectUri(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

type NaverTokenResponse = {
  access_token?: string;
  refresh_token?: string;
  error?: string;
  error_description?: string;
};

// Exchange the authorization code for a Naver access token client-side.
async function requestNaverAccessToken(code: string, state: string | null): Promise<string | null> {
  const params = new URLSearchParams({
    grant_type: "authorization_code",
    client_id: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
    client_secret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? "",
    code,
    state: state ?? "",
  });
  const response = await fetch(`${NAVER_TOKEN_URL}?${params.toString()}`);
  if (!response.ok) {
    return null;
  }
  const data = (await response.json()) as NaverTokenResponse;
  return data.access_token ?? null;
}

// Called by the shared web redirect dispatcher once it confirms the returning
// `?code=` belongs to Naver. We first exchange the code for a Naver access
// token, then hand that token to the backend.
async function exchangeNaverCode(code: string, state: string | null): Promise<void> {
  const accessToken = await requestNaverAccessToken(code, state);
  if (!accessToken) {
    return;
  }
  const result = await signIn({
    provider: "NAVER",
    token: accessToken,
    platform: "WEB",
  });
  if (result?.success && result.data) {
    useAuthStore.getState().authenticate({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });
  }
}

function useNaverLogin() {
  const handleNaverLogin = React.useCallback(() => {
    try {
      const params = new URLSearchParams({
        response_type: "code",
        client_id: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
        redirect_uri: getRedirectUri(),
        state: beginOauthState("naver"),
      });
      window.location.href = `${NAVER_AUTHORIZE_URL}?${params.toString()}`;
    } catch (error) {
      reportError(error, { area: "auth:naver-login" });
    }
  }, []);

  return { handleNaverLogin };
}

export { exchangeNaverCode, useNaverLogin };
