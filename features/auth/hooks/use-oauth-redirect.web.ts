import * as React from "react";

import { reportError } from "@/lib/error-reporting";

import { clearOauthState, resolveOauthState } from "../lib/oauth-state";
import { exchangeKakaoCode } from "./use-kakao-login.web";
import { processNaverRedirect } from "./use-naver-login.web";

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

function hasNaverHash(): boolean {
  return typeof window !== "undefined" && window.location.hash.includes("access_token");
}

// Single web callback handler. Kakao returns to the app root with `?code=&state=`
// (resolved via `state`); Naver uses its SDK's implicit flow and returns the
// token in the URL hash, handled by processNaverRedirect.
function useOauthRedirect() {
  const [isProcessing, setIsProcessing] = React.useState(
    () => Boolean(readRedirect()) || hasNaverHash(),
  );
  const handledRef = React.useRef(false);

  React.useEffect(() => {
    if (handledRef.current) return;
    handledRef.current = true;

    void (async () => {
      try {
        if (hasNaverHash()) {
          setIsProcessing(true);
          await processNaverRedirect();
          return;
        }

        const redirect = readRedirect();
        if (!redirect) {
          return;
        }

        const provider = resolveOauthState(redirect.state);
        if (provider === "kakao") {
          setIsProcessing(true);
          await exchangeKakaoCode(redirect.code);
        }
        clearRedirectParams();
        clearOauthState();
      } catch (error) {
        reportError(error, { area: "auth:oauth-exchange" });
      } finally {
        setIsProcessing(false);
      }
    })();
  }, []);

  return { isProcessing };
}

export { useOauthRedirect };
