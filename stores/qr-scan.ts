import { create } from "zustand";

type QrScanState = {
  pendingResult: string | null;
  setResult: (value: string) => void;
  clear: () => void;
};

const useQrScanStore = create<QrScanState>((set) => ({
  pendingResult: null,
  setResult: (pendingResult) => set({ pendingResult }),
  clear: () => set({ pendingResult: null }),
}));

export { useQrScanStore };
