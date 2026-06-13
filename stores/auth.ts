import { DEV_AUTH_TOKEN } from "@/constants/auth";
import { authStorage } from "@/lib/auth-storage";

import { create } from "zustand";

const STORAGE_KEY = "qlink-auth";

type AuthTokens = {
  accessToken: string | null;
  refreshToken: string | null;
};

type AuthState = AuthTokens & {
  hasHydrated: boolean;
  authenticate: (tokens: { accessToken: string; refreshToken?: string | null }) => void;
  setAccessToken: (accessToken: string | null) => void;
  setRefreshToken: (refreshToken: string | null) => void;
  signOut: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  refreshToken: null,
  hasHydrated: false,
  authenticate: ({ accessToken, refreshToken }) =>
    set({ accessToken, refreshToken: refreshToken ?? null }),
  setAccessToken: (accessToken) => set({ accessToken }),
  setRefreshToken: (refreshToken) => set({ refreshToken }),
  signOut: () => set({ accessToken: null, refreshToken: null }),
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
}));

async function hydrateAuthStore() {
  try {
    const raw = await authStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<AuthTokens>;
      useAuthStore.setState({
        accessToken: typeof parsed.accessToken === "string" ? parsed.accessToken : null,
        refreshToken: typeof parsed.refreshToken === "string" ? parsed.refreshToken : null,
      });
    }
  } catch {
    // ignore corrupt storage
  }
  if (!useAuthStore.getState().accessToken && DEV_AUTH_TOKEN) {
    useAuthStore.setState({ accessToken: DEV_AUTH_TOKEN });
  }
  useAuthStore.setState({ hasHydrated: true });
}

let unsubPersist: (() => void) | null = null;

function startAuthPersistence() {
  if (unsubPersist) return;
  unsubPersist = useAuthStore.subscribe((state, previous) => {
    if (
      state.accessToken === previous.accessToken &&
      state.refreshToken === previous.refreshToken
    ) {
      return;
    }
    void authStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ accessToken: state.accessToken, refreshToken: state.refreshToken }),
    );
  });
}

void hydrateAuthStore().then(() => {
  startAuthPersistence();
});

function getAccessTokenFromStore() {
  return useAuthStore.getState().accessToken;
}

function getRefreshTokenFromStore() {
  return useAuthStore.getState().refreshToken;
}

export { getAccessTokenFromStore, getRefreshTokenFromStore, useAuthStore };
export type { AuthState };
