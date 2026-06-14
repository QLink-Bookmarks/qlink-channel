import type { SearchMode } from "@/features/search/types";

import { create } from "zustand";

type SearchDialogState = {
  isOpen: boolean;
  mode: SearchMode;
  initialQuery: string;
  open: (options?: { mode?: SearchMode; query?: string }) => void;
  close: () => void;
  setOpen: (open: boolean) => void;
};

const useSearchDialog = create<SearchDialogState>((set) => ({
  isOpen: false,
  mode: "link",
  initialQuery: "",
  open: (options) =>
    set({
      isOpen: true,
      mode: options?.mode ?? "link",
      initialQuery: options?.query ?? "",
    }),
  close: () => set({ isOpen: false }),
  setOpen: (open) => set({ isOpen: open }),
}));

export { useSearchDialog };
