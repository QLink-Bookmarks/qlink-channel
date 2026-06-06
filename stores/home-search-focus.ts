import { create } from "zustand";

type HomeSearchFocusState = {
  /** Monotonically increasing counter — bumped each time someone requests focus. */
  nonce: number;
  requestFocus: () => void;
};

/**
 * Cross-component bridge so the mobile shell's AppHeader search icon can ask MobileHomeScreen
 * to focus its inline search field without prop drilling through the route shell.
 */
const useHomeSearchFocus = create<HomeSearchFocusState>((set) => ({
  nonce: 0,
  requestFocus: () => set((state) => ({ nonce: state.nonce + 1 })),
}));

export { useHomeSearchFocus };
