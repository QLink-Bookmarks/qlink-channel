import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";

import { signIn } from "../api";
import { beginOauthState } from "../lib/oauth-state";

const NAVER_AUTHORIZE_URL = "https://nid.naver.com/oauth2.0/authorize";

function getRedirectUri(): string {
  return typeof window !== "undefined" ? window.location.origin : "";
}

// Called by the shared web redirect dispatcher once it confirms the returning
// `?code=` belongs to Naver. The backend exchanges the authorization code
// (it holds the client secret), so we forward the code as the token.
async function exchangeNaverCode(code: string): Promise<void> {
  const result = await signIn({
    provider: "NAVER",
    token: code,
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
