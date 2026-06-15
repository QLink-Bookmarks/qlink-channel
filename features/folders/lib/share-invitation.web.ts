type ShareInvitationInput = {
  title: string;
  text: string;
};

type ShareInvitationResult = "shared" | "copied" | "cancelled" | "failed";

async function shareInvitation({
  title,
  text,
}: ShareInvitationInput): Promise<ShareInvitationResult> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(text);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}

export { shareInvitation };
export type { ShareInvitationInput, ShareInvitationResult };
