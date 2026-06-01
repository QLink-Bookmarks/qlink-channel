import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

const SessionStorage: StateStorage = {
  async getItem(name) {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  async setItem(name, value) {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // ignore — write failures shouldn't crash hydration
    }
  },
  async removeItem(name) {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // ignore
    }
  },
};

export { SessionStorage };
