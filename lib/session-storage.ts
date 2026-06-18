import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

const KEYCHAIN_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainService: "qlink",
  accessGroup: "group.com.qlinkapps.qlink",
};

const SessionStorage: StateStorage = {
  async getItem(name) {
    try {
      return await SecureStore.getItemAsync(name, KEYCHAIN_OPTIONS);
    } catch {
      return null;
    }
  },
  async setItem(name, value) {
    try {
      await SecureStore.setItemAsync(name, value, KEYCHAIN_OPTIONS);
    } catch {
      // ignore — write failures shouldn't crash hydration
    }
  },
  async removeItem(name) {
    try {
      await SecureStore.deleteItemAsync(name, KEYCHAIN_OPTIONS);
    } catch {
      // ignore
    }
  },
};

export { SessionStorage, KEYCHAIN_OPTIONS };
