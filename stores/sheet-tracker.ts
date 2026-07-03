import { create } from "zustand";

// Tracks how many bottom sheets are currently open so global chrome (e.g. the
// mobile FAB) can hide whenever *any* sheet is up — not just specific ones.
// Every <Sheet> registers itself while open (see components/layout/sheet.tsx).
type SheetTrackerState = {
  openCount: number;
  registerOpen: () => void;
  registerClose: () => void;
};

const useSheetTracker = create<SheetTrackerState>((set) => ({
  openCount: 0,
  registerOpen: () => set((state) => ({ openCount: state.openCount + 1 })),
  registerClose: () => set((state) => ({ openCount: Math.max(0, state.openCount - 1) })),
}));

function useAnySheetOpen() {
  return useSheetTracker((state) => state.openCount > 0);
}

export { useSheetTracker, useAnySheetOpen };
