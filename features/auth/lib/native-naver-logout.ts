import type { ConnectedAuthProvider } from "@/features/account/types";
import NaverLogin from "@react-native-seoul/naver-login";

import { normalizeSocialProvider } from "./provider-brand";

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

// deleteToken hits Naver's servers to revoke and can hang on a flaky network, so
// cap each native call. Resolves (never rejects) when the cap is hit.
function withTimeout(promise: Promise<unknown>, ms: number): Promise<void> {
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

// Only Naver silently reuses its cached session, so it's the lone provider we
// clear on logout / withdrawal. No-op when the account has no Naver connection.
// Best-effort and bounded: callers should NOT await this in a way that blocks the
// actual sign-out (see settings handlers — fire-and-forget).
async function logoutNaver(connectedProviders: ConnectedAuthProvider[]) {
  const hasNaver = connectedProviders.some(
    (provider) => normalizeSocialProvider(provider.type) === "NAVER",
  );
  if (!hasNaver) return;
  try {
    ensureInitialized();
    await withTimeout(NaverLogin.logout(), 4000);
    await withTimeout(NaverLogin.deleteToken(), 4000);
  } catch {
    // ignore — clearing the native session must not break logout/withdrawal
  }
}

export { logoutNaver };
