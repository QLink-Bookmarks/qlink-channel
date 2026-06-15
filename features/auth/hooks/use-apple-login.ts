import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";

import { signIn } from "../api";

import * as AppleAuthentication from "expo-apple-authentication";

function useAppleLogin() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleAppleLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      const idToken = credential.identityToken;
      if (!idToken) {
        return;
      }
      const result = await signIn({ provider: "APPLE", token: idToken, platform: "NATIVE" });
      if (result?.success && result.data) {
        authenticate({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });
      }
    } catch (error) {
      if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED") {
        return;
      }
      reportError(error, { area: "auth:apple-login" });
    } finally {
      setIsLoading(false);
    }
  }, [authenticate]);

  return { handleAppleLogin, isLoading };
}

export { useAppleLogin };
