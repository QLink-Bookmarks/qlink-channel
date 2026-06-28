import { SessionStorage } from "@/lib/session-storage";

import { create } from "zustand";

const STORAGE_KEY = "qlink-onboarding";

type OnboardingState = {
  completed: boolean;
  hasHydrated: boolean;
  complete: () => void;
  reset: () => void;
  setHasHydrated: (hasHydrated: boolean) => void;
};

const useOnboardingStore = create<OnboardingState>((set) => ({
  completed: false,
  hasHydrated: false,
  complete: () => set({ completed: true }),
  reset: () => set({ completed: false }),
  setHasHydrated: (hasHydrated) => set({ hasHydrated }),
}));

async function hydrateOnboardingStore() {
  try {
    const raw = await SessionStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<OnboardingState>;
      if (typeof parsed.completed === "boolean") {
        useOnboardingStore.setState({ completed: parsed.completed });
      }
    }
  } catch {
    // ignore corrupt storage
  }
  useOnboardingStore.setState({ hasHydrated: true });
}

let unsubPersist: (() => void) | null = null;

function startOnboardingPersistence() {
  if (unsubPersist) return;
  unsubPersist = useOnboardingStore.subscribe((state, previous) => {
    if (state.completed === previous.completed) {
      return;
    }
    if (state.completed) {
      void SessionStorage.setItem(STORAGE_KEY, JSON.stringify({ completed: true }));
    } else {
      void SessionStorage.removeItem(STORAGE_KEY);
    }
  });
}

void hydrateOnboardingStore().then(() => {
  startOnboardingPersistence();
});

export { useOnboardingStore };
