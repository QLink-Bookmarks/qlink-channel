import * as SecureStore from "expo-secure-store";
import type { StateStorage } from "zustand/middleware";

const KEYCHAIN_OPTIONS: SecureStore.SecureStoreOptions = {
  keychainService: "qlink",
  accessGroup: "group.com.qlinkapps.qlink",
};

// Hard ceiling on the read that gates store hydration. If SecureStore/keychain
// ever stalls (e.g. missing access-group entitlement), hydration must still
// resolve so the app never hangs on the "인증 정보를 확인 중입니다…" splash.
const READ_TIMEOUT_MS = 4000;

function withTimeout<T>(promise: Promise<T>, fallback: T): Promise<T> {
  return new Promise<T>((resolve) => {
    const timer = setTimeout(() => resolve(fallback), READ_TIMEOUT_MS);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      () => {
        clearTimeout(timer);
        resolve(fallback);
      },
    );
  });
}

const SessionStorage: StateStorage = {
  async getItem(name) {
    try {
      return await withTimeout(SecureStore.getItemAsync(name, KEYCHAIN_OPTIONS), null);
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
