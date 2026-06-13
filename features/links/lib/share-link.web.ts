type ShareLinkInput = {
  url: string;
  title: string;
  text: string;
};

type ShareLinkResult = "shared" | "copied" | "cancelled" | "failed";

async function shareLink({ url, title, text }: ShareLinkInput): Promise<ShareLinkResult> {
  if (typeof navigator !== "undefined" && typeof navigator.share === "function") {
    try {
      await navigator.share({ url, title, text });
      return "shared";
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return "cancelled";
      }
    }
  }
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    try {
      await navigator.clipboard.writeText(`${text}`);
      return "copied";
    } catch {
      return "failed";
    }
  }
  return "failed";
}

export { shareLink };
export type { ShareLinkInput, ShareLinkResult };
