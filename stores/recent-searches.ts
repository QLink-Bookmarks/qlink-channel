import { SessionStorage } from "@/lib/session-storage";

import { create } from "zustand";

const STORAGE_KEY = "recent-searches.v1";
const MAX_RECENT = 8;

type RecentSearchesState = {
  recents: string[];
  add: (query: string) => void;
  remove: (query: string) => void;
  clear: () => void;
};

const useRecentSearches = create<RecentSearchesState>((set) => ({
  recents: [],
  add: (query) =>
    set((state) => {
      const trimmed = query.trim();
      if (!trimmed) {
        return state;
      }
      const next = [trimmed, ...state.recents.filter((item) => item !== trimmed)].slice(
        0,
        MAX_RECENT,
      );
      return { recents: next };
    }),
  remove: (query) => set((state) => ({ recents: state.recents.filter((item) => item !== query) })),
  clear: () => set({ recents: [] }),
}));

async function hydrateRecentSearches() {
  try {
    const raw = await SessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return;
    }
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) {
      useRecentSearches.setState({
        recents: parsed
          .filter((item): item is string => typeof item === "string")
          .slice(0, MAX_RECENT),
      });
    }
  } catch {
    // ignore — fall back to empty list
  }
}

let previousPersisted: string | null = null;

useRecentSearches.subscribe((state) => {
  const next = JSON.stringify(state.recents);
  if (next === previousPersisted) {
    return;
  }
  previousPersisted = next;
  SessionStorage.setItem(STORAGE_KEY, next);
});

void hydrateRecentSearches();

export { hydrateRecentSearches, useRecentSearches };
