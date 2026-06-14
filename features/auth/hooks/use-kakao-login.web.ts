import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import {
  issueAccessTokenWithCodeWeb,
  login as kakaoLogin,
  setAccessTokenWeb,
} from "@react-native-kakao/user";

import { signIn } from "../api";
import { beginOauthState } from "../lib/oauth-state";

import { createURL } from "expo-linking";

function getRedirectUri(): string {
  return createURL("");
}

// Called by the shared web redirect dispatcher once it confirms the returning
// `?code=` belongs to Kakao (via `state`).
async function exchangeKakaoCode(code: string): Promise<void> {
  const socialToken = await issueAccessTokenWithCodeWeb({
    code,
    redirectUri: getRedirectUri(),
  });
  if (!socialToken) {
    return;
  }
  setAccessTokenWeb(socialToken.accessToken);
  const result = await signIn({
    provider: "KAKAO",
    token: socialToken.accessToken,
    platform: "WEB",
  });
  if (result?.success && result.data) {
    useAuthStore.getState().authenticate({
      accessToken: result.data.accessToken,
      refreshToken: result.data.refreshToken,
    });
  }
}

function useKakaoLogin() {
  const handleKakaoLogin = React.useCallback(async () => {
    try {
      await kakaoLogin({
        web: {
          redirectUri: getRedirectUri(),
          prompt: ["select_account"],
          state: beginOauthState("kakao"),
        },
      });
    } catch (error) {
      reportError(error, { area: "auth:kakao-login" });
    }
  }, []);

  return { handleKakaoLogin };
}

export { exchangeKakaoCode, useKakaoLogin };
