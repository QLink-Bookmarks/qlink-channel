import * as React from "react";

import { reportError } from "@/lib/error-reporting";
import { GoogleSignin, isSuccessResponse } from "@react-native-google-signin/google-signin";
import { login as kakaoLogin } from "@react-native-kakao/user";
import NaverLogin from "@react-native-seoul/naver-login";

import { type ConnectOutcome, connectWithToken } from "../lib/connect-with-token";
import type { SocialProvider } from "../lib/provider-brand";
import { useConnectFeedback } from "./use-connect-feedback";

import * as AppleAuthentication from "expo-apple-authentication";

let googleConfigured = false;
function ensureGoogleConfigured() {
  if (googleConfigured) return;
  GoogleSignin.configure({
    iosClientId: process.env.EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID,
    webClientId: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID,
    offlineAccess: true,
  });
  googleConfigured = true;
}

let naverInitialized = false;
function ensureNaverInitialized() {
  if (naverInitialized) return;
  NaverLogin.initialize({
    appName: "QLink",
    consumerKey: process.env.EXPO_PUBLIC_NAVER_CLIENT_ID ?? "",
    consumerSecret: process.env.EXPO_PUBLIC_NAVER_CLIENT_SECRET ?? "",
    serviceUrlSchemeIOS: process.env.EXPO_PUBLIC_NAVER_URL_SCHEME ?? "",
  });
  naverInitialized = true;
}

// Bound a native Naver call so a stalled SDK promise can't hang the connect
// flow. Resolves (never rejects) after the cap or on settle.
function withNaverTimeout(promise: Promise<unknown>, ms = 4000): Promise<void> {
  return new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms);
    promise.then(
      () => {
        clearTimeout(timer);
        resolve();
      },
      () => {
        clearTimeout(timer);
        resolve();
      },
    );
  });
}

async function acquireNativeToken(provider: SocialProvider): Promise<string | null> {
  switch (provider) {
    case "GOOGLE": {
      ensureGoogleConfigured();
      await GoogleSignin.hasPlayServices();
      const response = await GoogleSignin.signIn();
      if (!isSuccessResponse(response)) return null;
      return response.data.idToken ?? null;
    }
    case "APPLE": {
      const credential = await AppleAuthentication.signInAsync({
        requestedScopes: [
          AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
          AppleAuthentication.AppleAuthenticationScope.EMAIL,
        ],
      });
      return credential.identityToken ?? null;
    }
    case "KAKAO": {
      const token = await kakaoLogin();
      return token?.accessToken ?? null;
    }
    case "NAVER": {
      ensureNaverInitialized();
      // Naver reuses its cached session and silently re-links the previous
      // account. Clear the local token so the user gets to pick an account.
      // Bounded so a stalled native call can't hang the connect button — and we
      // skip deleteToken() (a server revoke that can hang and isn't needed to
      // re-prompt).
      await withNaverTimeout(NaverLogin.logout());
      const response = await NaverLogin.login();
      return response.isSuccess ? (response.successResponse?.accessToken ?? null) : null;
    }
  }
}

// Connect an additional social provider to the signed-in account using the
// native SDKs (no browser redirect — tokens resolve inline).
function useConnectSocial() {
  const applyOutcome = useConnectFeedback();
  const [pendingProvider, setPendingProvider] = React.useState<SocialProvider | null>(null);

  const connect = React.useCallback(
    async (provider: SocialProvider): Promise<ConnectOutcome | undefined> => {
      setPendingProvider(provider);
      try {
        const token = await acquireNativeToken(provider);
        if (!token) return undefined;
        const outcome = await connectWithToken(provider, token, "NATIVE");
        await applyOutcome(outcome);
        return outcome;
      } catch (error) {
        if ((error as { code?: string })?.code === "ERR_REQUEST_CANCELED") {
          return undefined;
        }
        reportError(error, { area: "auth:connect-native", extra: { provider } });
        return undefined;
      } finally {
        setPendingProvider(null);
      }
    },
    [applyOutcome],
  );

  return { connect, pendingProvider };
}

export { useConnectSocial };
