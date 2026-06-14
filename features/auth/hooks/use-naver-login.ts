import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import NaverLogin from "@react-native-seoul/naver-login";

import { signIn } from "../api";

let initialized = false;

function ensureInitialized() {
  if (initialized) return;
  NaverLogin.initialize({
    appName: "QLink",
    consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
    consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? "",
    serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_NAVER_URL_SCHEME ?? "",
  });
  initialized = true;
}

function useNaverLogin() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleNaverLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      ensureInitialized();
      const response = await NaverLogin.login();
      if (!response.isSuccess || !response.successResponse) {
        return;
      }
      const result = await signIn({
        provider: "NAVER",
        token: response.successResponse.accessToken,
        platform: "NATIVE",
      });
      if (result?.success && result.data) {
        authenticate({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });
      }
    } catch (error) {
      reportError(error, { area: "auth:naver-login" });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate]);

  return { handleNaverLogin, isLoading };
}

export { useNaverLogin };
