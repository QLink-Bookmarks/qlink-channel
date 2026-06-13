import { Platform, Share } from "react-native";

type ShareLinkInput = {
  url: string;
  title: string;
  text: string;
};

type ShareLinkResult = "shared" | "cancelled";

async function shareLink({ url, title, text }: ShareLinkInput): Promise<ShareLinkResult> {
  const message = Platform.OS === "ios" ? text : `${text}\n\n${url}`;
  const result = await Share.share(
    {
      url,
      message,
      title,
    },
    { dialogTitle: title },
  );
  return result.action === Share.dismissedAction ? "cancelled" : "shared";
}

export { shareLink };
export type { ShareLinkInput, ShareLinkResult };
