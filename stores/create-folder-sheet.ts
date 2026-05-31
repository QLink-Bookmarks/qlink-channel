import { create } from "zustand";

type CreateFolderSheetState = {
  isOpen: boolean;
  open: () => void;
  close: () => void;
  setOpen: (open: boolean) => void;
};

const useCreateFolderSheet = create<CreateFolderSheetState>((set) => ({
  isOpen: false,
  open: () => set({ isOpen: true }),
  close: () => set({ isOpen: false }),
  setOpen: (isOpen) => set({ isOpen }),
}));

export { useCreateFolderSheet };
