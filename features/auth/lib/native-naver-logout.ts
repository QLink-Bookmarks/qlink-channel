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

// Only Naver silently reuses its cached session, so it's the lone provider we
// clear on logout / withdrawal. No-op when the account has no Naver connection.
// Best-effort: never throws, so it can't block sign-out.
async function logoutNaver(connectedProviders: ConnectedAuthProvider[]) {
  const hasNaver = connectedProviders.some(
    (provider) => normalizeSocialProvider(provider.type) === "NAVER",
  );
  if (!hasNaver) return;
  try {
    ensureInitialized();
    await NaverLogin.logout();
    await NaverLogin.deleteToken();
  } catch {
    // ignore — clearing the native session must not break logout/withdrawal
  }
}

export { logoutNaver };
