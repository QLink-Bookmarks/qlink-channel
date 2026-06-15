import { Share } from "react-native";

type ShareInvitationInput = {
  title: string;
  text: string;
};

type ShareInvitationResult = "shared" | "copied" | "cancelled" | "failed";

async function shareInvitation({
  title,
  text,
}: ShareInvitationInput): Promise<ShareInvitationResult> {
  try {
    const result = await Share.share({ message: text, title }, { dialogTitle: title });
    return result.action === Share.dismissedAction ? "cancelled" : "shared";
  } catch {
    return "failed";
  }
}

export { shareInvitation };
export type { ShareInvitationInput, ShareInvitationResult };
