// Shared OAuth `state` helper so multiple providers can share a single web
// redirect target (the app root) without their callbacks colliding. The state
// encodes the provider and a random token that we verify on return (CSRF).

type OauthProvider = "kakao" | "naver";

const STATE_STORAGE_KEY = "qlink.oauth.state";

function randomToken(): string {
  const cryptoRef = (globalThis as { crypto?: { randomUUID?: () => string } }).crypto;
  if (cryptoRef?.randomUUID) {
    return cryptoRef.randomUUID().replace(/-/g, "");
  }
  return `${Math.random().toString(36).slice(2)}${Math.random().toString(36).slice(2)}`;
}

function getSessionStorage(): Storage | null {
  try {
    return typeof sessionStorage !== "undefined" ? sessionStorage : null;
  } catch {
    return null;
  }
}

// Build a `<provider>:<token>` state and persist it for the round trip.
function beginOauthState(provider: OauthProvider): string {
  const state = `${provider}:${randomToken()}`;
  getSessionStorage()?.setItem(STATE_STORAGE_KEY, state);
  return state;
}

// Return the provider only if the returned state exactly matches what we stored.
function resolveOauthState(returnedState: string | null): OauthProvider | null {
  if (!returnedState) return null;
  const stored = getSessionStorage()?.getItem(STATE_STORAGE_KEY);
  if (!stored || stored !== returnedState) return null;
  const provider = returnedState.split(":")[0];
  return provider === "kakao" || provider === "naver" ? provider : null;
}

function clearOauthState(): void {
  getSessionStorage()?.removeItem(STATE_STORAGE_KEY);
}

export { beginOauthState, clearOauthState, resolveOauthState };
export type { OauthProvider };
