import * as React from "react";

import { reportError } from "@/lib/error-reporting";

import { clearOauthState, resolveOauthState } from "../lib/oauth-state";
import { exchangeKakaoCode } from "./use-kakao-login.web";
import { exchangeNaverCode } from "./use-naver-login.web";

type OauthRedirect = { code: string; state: string | null };

function readRedirect(): OauthRedirect | null {
  if (typeof window === "undefined") return null;
  const url = new URL(window.location.href);
  const code = url.searchParams.get("code");
  if (!code) return null;
  return { code, state: url.searchParams.get("state") };
}

function clearRedirectParams() {
  if (typeof window === "undefined") return;
  // Defer so it runs after expo-router finishes asserting the initial URL on
  // hydration, otherwise the router re-adds the stale params.
  setTimeout(() => {
    const url = new URL(window.location.href);
    url.searchParams.delete("code");
    url.searchParams.delete("state");
    window.history.replaceState(null, "", url.toString());
  }, 0);
}

// Single web callback handler. Every provider redirects back to the app root
// with `?code=&state=`; this resolves the provider from `state` and dispatches
// to that provider's exchange, so the callbacks never collide.
function useOauthRedirect() {
  const [isProcessing, setIsProcessing] = React.useState(() => Boolean(readRedirect()));
  const handledRef = React.useRef(false);

  React.useEffect(() => {
    if (handledRef.current) return;
    const redirect = readRedirect();
    if (!redirect) return;
    handledRef.current = true;

    const provider = resolveOauthState(redirect.state);
    if (!provider) {
      clearRedirectParams();
      clearOauthState();
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    void (async () => {
      try {
        if (provider === "kakao") {
          await exchangeKakaoCode(redirect.code);
        } else if (provider === "naver") {
          await exchangeNaverCode(redirect.code);
        }
      } catch (error) {
        reportError(error, { area: `auth:${provider}-exchange` });
      } finally {
        clearRedirectParams();
        clearOauthState();
        setIsProcessing(false);
      }
    })();
  }, []);

  return { isProcessing };
}

export { useOauthRedirect };
