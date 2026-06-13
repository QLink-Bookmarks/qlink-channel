import type { StateStorage } from "zustand/middleware";

const authStorage: StateStorage = {
  getItem(name) {
    if (typeof localStorage === "undefined") {
      return null;
    }
    return localStorage.getItem(name);
  },
  setItem(name, value) {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.setItem(name, value);
  },
  removeItem(name) {
    if (typeof localStorage === "undefined") {
      return;
    }
    localStorage.removeItem(name);
  },
};

export { authStorage };
