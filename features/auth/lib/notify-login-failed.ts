import { useToastStore } from "@/stores/toast-store";

// Shared login-failure toast. Call only for real failures (server rejection or
// network/SDK errors) — never for user cancellation.
function notifyLoginFailed() {
  useToastStore.getState().showToast({
    title: "로그인에 실패했어요",
    description: "잠시 후 다시 시도해주세요.",
    variant: "error",
    sourceKey: "auth-login",
    dismissible: true,
  });
}

export { notifyLoginFailed };
