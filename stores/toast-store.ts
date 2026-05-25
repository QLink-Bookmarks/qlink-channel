import { create } from "zustand";

type ToastVariant = "default" | "success" | "error" | "warning" | "gradient";

type ToastItem = {
  id: string;
  variant: ToastVariant;
  title: string;
  description?: string;
  durationMs?: number;
  createdAt: number;
  dismissible?: boolean;
  showProgress?: boolean;
  actionLabel?: string;
  onAction?: () => void;
  sourceKey?: string;
};

type ShowToastInput = Omit<ToastItem, "createdAt" | "id"> & {
  id?: string;
};

type ToastState = {
  items: ToastItem[];
  showToast: (toast: ShowToastInput) => string;
  dismissToast: (id: string) => void;
  dismissAllToasts: () => void;
  updateToast: (id: string, nextToast: Partial<Omit<ToastItem, "id">>) => void;
  pruneExpiredToasts: (now?: number) => void;
};

const DEFAULT_TOAST_DURATION_MS = 4200;
const MAX_VISIBLE_TOASTS = 3;

function createToastId() {
  return `toast-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

const useToastStore = create<ToastState>((set) => ({
  items: [],
  showToast: (toast) => {
    const nextId = toast.id ?? createToastId();
    const nextCreatedAt = Date.now();

    set((state) => {
      const existingToast =
        toast.sourceKey !== undefined
          ? state.items.find((item) => item.sourceKey === toast.sourceKey)
          : undefined;

      const nextItem: ToastItem = {
        ...toast,
        createdAt: nextCreatedAt,
        dismissible: toast.dismissible ?? true,
        durationMs: toast.durationMs ?? DEFAULT_TOAST_DURATION_MS,
        id: existingToast?.id ?? nextId,
        variant: toast.variant ?? "default",
      };

      if (existingToast) {
        return {
          items: state.items
            .map((item) => (item.id === existingToast.id ? nextItem : item))
            .sort((a, b) => a.createdAt - b.createdAt)
            .slice(-MAX_VISIBLE_TOASTS),
        };
      }

      return {
        items: [...state.items, nextItem]
          .sort((a, b) => a.createdAt - b.createdAt)
          .slice(-MAX_VISIBLE_TOASTS),
      };
    });

    return nextId;
  },
  dismissToast: (id) =>
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    })),
  dismissAllToasts: () => set({ items: [] }),
  updateToast: (id, nextToast) =>
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...nextToast,
            }
          : item,
      ),
    })),
  pruneExpiredToasts: (now = Date.now()) =>
    set((state) => ({
      items: state.items.filter((item) => {
        if (item.durationMs === 0) {
          return true;
        }

        const durationMs = item.durationMs ?? DEFAULT_TOAST_DURATION_MS;
        return now - item.createdAt < durationMs;
      }),
    })),
}));

export { DEFAULT_TOAST_DURATION_MS, MAX_VISIBLE_TOASTS, useToastStore };
export type { ShowToastInput, ToastItem, ToastVariant };
