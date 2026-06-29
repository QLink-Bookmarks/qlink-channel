import { isAxiosError } from "axios";

const FALLBACK_MESSAGE = "잠시 후 다시 시도해주세요.";

// Prefer the server envelope's error.message; otherwise fall back to the raw
// error's message, then a generic line.
function getAgreementErrorMessage(error: unknown): string {
  if (isAxiosError(error)) {
    const envelopeMessage = (error.response?.data as { error?: { message?: string } } | undefined)
      ?.error?.message;
    if (typeof envelopeMessage === "string" && envelopeMessage.trim()) {
      return envelopeMessage;
    }
  }
  if (error instanceof Error && error.message.trim()) {
    return error.message;
  }
  return FALLBACK_MESSAGE;
}

export { getAgreementErrorMessage };
