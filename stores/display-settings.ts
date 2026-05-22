import { type AccentName, DEFAULT_ACCENT, type ThemeMode } from "@/lib/theme";

import { create } from "zustand";

type DisplayState = {
  display: {
    theme: ThemeMode;
    accent: AccentName;
  };
  setTheme: (theme: ThemeMode) => void;
  toggleTheme: () => void;
  setAccent: (accent: AccentName) => void;
};

const useDisplaySettings = create<DisplayState>((set) => ({
  display: {
    theme: "light",
    accent: DEFAULT_ACCENT,
  },
  setTheme: (theme) =>
    set((state) => ({
      display: {
        ...state.display,
        theme,
      },
    })),
  toggleTheme: () =>
    set((state) => ({
      display: {
        ...state.display,
        theme: state.display.theme === "light" ? "dark" : "light",
      },
    })),
  setAccent: (accent) =>
    set((state) => ({
      display: {
        ...state.display,
        accent,
      },
    })),
}));

export { useDisplaySettings };
