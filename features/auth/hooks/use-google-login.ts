import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { useAuthStore } from "@/stores/auth";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";

import { signIn } from "../api";
import { notifyLoginFailed } from "../lib/notify-login-failed";

let configured = false;

function ensureConfigured() {
  if (configured) return;
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    // offlineAccess + webClientId yields a serverAuthCode (authorization code).
    offlineAccess: true,
  });
  configured = true;
}

function useGoogleLogin() {
  const authenticate = useAuthStore((state) => state.authenticate);
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleLogin = React.useCallback(async () => {
    setIsLoading(true);
    try {
      ensureConfigured();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) {
        return;
      }
      // serverAuthCode = authorization code, idToken = identity token.
      const token = response.data.idToken;
      if (!token) {
        return;
      }
      const result = await signIn({
        provider: "GOOGLE",
        token,
        platform: "NATIVE",
      });
      if (result?.success && result.data) {
        authenticate({
          accessToken: result.data.accessToken,
          refreshToken: result.data.refreshToken,
        });
      } else {
        notifyLoginFailed();
      }
    } catch (error) {
      reportError(error, { area: "auth:google-login" });
      notifyLoginFailed();
    } finally {
      setIsLoading(false);
    }
  }, [authenticate]);

  return { handleGoogleLogin, isLoading };
}

export { useGoogleLogin };
