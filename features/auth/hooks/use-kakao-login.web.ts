import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import {
  issueAccessTokenWithCodeWeb,
  login as kakaoLogin,
  setAccessTokenWeb,
} from "@react-native-kakao/user";

import { signIn } from "../api";

import { createURL } from "expo-linking";

function readAuthorizationCode(): string | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  return url.searchParams.get("code");
}

function clearAuthorizationParams() {
  if (typeof window === "undefined") return;
  const url = new URL(window.location.href);
  url.searchParams.delete("code");
  url.searchParams.delete("state");
  window.history.replaceState(null, "", url.toString());
}

function useKakaoLogin() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [isLoading, setIsLoading] = React.useState(() => Boolean(readAuthorizationCode()));
  const exchangedRef = React.useRef(false);
  const redirectUri = React.useMemo(() => createURL(""), []);

  React.useEffect(() => {
    if (exchangedRef.current) return;
    const code = readAuthorizationCode();
    if (!code) return;
    exchangedRef.current = true;
    setIsLoading(true);
    (async () => {
      try {
        const socialToken = await issueAccessTokenWithCodeWeb({
          code,
          redirectUri,
        });
        if (!socialToken) {
          return;
        }
        setAccessTokenWeb(socialToken.accessToken);
        const response = await signIn({
          provider: "KAKAO",
          token: socialToken.accessToken,
          platform: "WEB",
        });
        if (response?.success && response.data) {
          authenticate({
            accessToken: response.data.accessToken,
            refreshToken: response.data.refreshToken,
          });
        }
      } catch (error) {
        reportError(error, { area: "auth:kakao-login-exchange" });
      } finally {
        clearAuthorizationParams();
        setIsLoading(false);
      }
    })();
  }, [authenticate, redirectUri]);

  const handleKakaoLogin = React.useCallback(async () => {
    try {
      await kakaoLogin({
        web: {
          redirectUri,
          prompt: ["select_account"],
        },
      });
    } catch (error) {
      reportError(error, { area: "auth:kakao-login" });
    }
  }, [redirectUri]);

  return { handleKakaoLogin, isLoading };
}

export { useKakaoLogin };
