import * as React from "react";

import { reportError } from "@/lib/error-reporting";

import { type ConnectOutcome, connectWithToken } from "../lib/connect-with-token";
import type { SocialProvider } from "../lib/provider-brand";
import { useConnectFeedback } from "./use-connect-feedback";
import { beginKakaoConnect } from "./use-kakao-login.web";
import { beginNaverConnect } from "./use-naver-login.web";

type GoogleTokenResponse = { access_token?: string; error?: string };
type GoogleTokenClient = { requestAccessToken: () => void };
type GoogleIdentityServices = {
  accounts: {
    oauth2: {
      initTokenClient: (config: {
        client_id: string;
        scope: string;
        callback: (response: GoogleTokenResponse) => void;
      }) => GoogleTokenClient;
    };
  };
};

function acquireGoogleWebToken(): Promise<string | null> {
  const google = (window as unknown as { google?: GoogleIdentityServices }).google;
  if (!google?.accounts?.oauth2) {
    return Promise.reject(new Error("Google Identity Services script not loaded"));
  }
  return new Promise<string | null>((resolve) => {
    const client = google.accounts.oauth2.initTokenClient({
      client_id: process.env.EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID ?? "",
      scope: "openid email profile",
      callback: (response) => resolve(response.access_token ?? null),
    });
    client.requestAccessToken();
  });
}

type AppleSignInResponse = { authorization?: { id_token?: string } };
type AppleID = {
  auth: {
    init: (config: {
      clientId: string;
      scope?: string;
      redirectURI: string;
      usePopup?: boolean;
    }) => void;
    signIn: () => Promise<AppleSignInResponse>;
  };
};

let appleInitialized = false;
async function acquireAppleWebToken(): Promise<string | null> {
  const appleId = (window as unknown as { AppleID?: AppleID }).AppleID;
  if (!appleId) {
    return Promise.reject(new Error("Apple JS SDK not loaded"));
  }
  if (!appleInitialized) {
    appleId.auth.init({
      clientId: process.env.EXPO_PUBLIC_APPLE_WEB_CLIENT_ID ?? "",
      scope: "name email",
      redirectURI: window.location.origin,
      usePopup: true,
    });
    appleInitialized = true;
  }
  const data = await appleId.auth.signIn();
  return data.authorization?.id_token ?? null;
}

// Connect an additional social provider on web. Google/Apple use popups and
// resolve inline; Kakao/Naver do a full-page redirect, with completion handled
// on return by the OAuth redirect dispatcher.
function useConnectSocial() {
  const applyOutcome = useConnectFeedback();
  const [pendingProvider, setPendingProvider] = React.useState<SocialProvider | null>(null);

  const connect = React.useCallback(
    async (provider: SocialProvider): Promise<ConnectOutcome | undefined> => {
      setPendingProvider(provider);
      try {
        if (provider === "KAKAO") {
          await beginKakaoConnect();
          return undefined;
        }
        if (provider === "NAVER") {
          await beginNaverConnect();
          return undefined;
        }
        const token =
          provider === "GOOGLE" ? await acquireGoogleWebToken() : await acquireAppleWebToken();
        if (!token) return undefined;
        const outcome = await connectWithToken(provider, token, "WEB");
        await applyOutcome(outcome);
        return outcome;
      } catch (error) {
        reportError(error, { area: "auth:connect-web", extra: { provider } });
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
