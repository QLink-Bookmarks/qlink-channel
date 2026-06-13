import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import { login as kakaoLogin } from "@react-native-kakao/user";

import { signIn } from "../api";

function useKakaoLogin() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleKakaoLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const token = await kakaoLogin();
      if (!token?.accessToken) {
        return;
      }
      const response = await signIn({
        provider: "KAKAO",
        token: token.accessToken,
        platform: "NATIVE",
      });
      if (response?.success && response.data) {
        authenticate({
          accessToken: response.data.accessToken,
          refreshToken: response.data.refreshToken,
        });
      }
    } catch (error) {
      reportError(error, { area: "auth:kakao-login" });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate]);

  return { handleKakaoLogin, isLoading };
}

export { useKakaoLogin };
