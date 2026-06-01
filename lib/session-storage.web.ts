import type { StateStorage } from "zustand/middleware";

function getStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }
  try {
    return window.sessionStorage;
  } catch {
    return null;
  }
}

const SessionStorage: StateStorage = {
  getItem(name) {
    return getStorage()?.getItem(name) ?? null;
  },
  setItem(name, value) {
    getStorage()?.setItem(name, value);
  },
  removeItem(name) {
    getStorage()?.removeItem(name);
  },
};

export { SessionStorage };
