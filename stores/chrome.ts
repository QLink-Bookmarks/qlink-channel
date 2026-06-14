import { create } from "zustand";

type ChromeState = {
  // Measured height of the mobile bottom tab bar (0 when it is not mounted,
  // e.g. on the auth screen or wide layouts). Used to anchor toasts just above it.
  bottomTabsHeight: number;
  setBottomTabsHeight: (height: number) => void;
};

const useChromeStore = create<ChromeState>((set) => ({
  bottomTabsHeight: 0,
  setBottomTabsHeight: (height) =>
    set((state) => (state.bottomTabsHeight === height ? state : { bottomTabsHeight: height })),
}));

export { useChromeStore };
export type { ChromeState };
