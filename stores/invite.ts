import { SessionStorage } from "@/lib/session-storage";

import { create } from "zustand";

const STORAGE_KEY = "qlink-pending-invite";

type PendingInvite = {
  token: string;
  folderId: string;
};

type InviteState = {
  pending: PendingInvite | null;
  hasHydrated: boolean;
  setPending: (pending: PendingInvite) => void;
  clearPending: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const useInviteStore = create<InviteState>((set) => ({
  pending: null,
  hasHydrated: false,
  setPending: (pending) => set({ pending }),
  clearPending: () => set({ pending: null }),
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
}));

async function hydrateInviteStore() {
  try {
    const raw = await SessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<PendingInvite>;
      if (typeof parsed.token === "string" && typeof parsed.folderId === "string") {
        useInviteStore.setState({ pending: { token: parsed.token, folderId: parsed.folderId } });
      }
    }
  } catch {
    // ignore corrupt storage
  }
  useInviteStore.setState({ hasHydrated: true });
}

let unsubPersist: (() => void) | null = null;

function startInvitePersistence() {
  if (unsubPersist) return;
  unsubPersist = useInviteStore.subscribe((state, previous) => {
    if (state.pending === previous.pending) {
      return;
    }
    if (state.pending) {
      void SessionStorage.setItem(STORAGE_KEY, JSON.stringify(state.pending));
    } else {
      void SessionStorage.removeItem(STORAGE_KEY);
    }
  });
}

void hydrateInviteStore().then(() => {
  startInvitePersistence();
});

export { useInviteStore };
export type { InviteState, PendingInvite };
