import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

const authStorage: StateStorage = {
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
      // ignore
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

export { authStorage };
