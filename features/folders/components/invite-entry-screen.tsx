import * as React from "react";
import { View } from "react-native";

import { OpenInAppBanner } from "@/components/layout/open-in-app-banner";
import { ActivityIndicator } from "@/components/ui/activity-indicator";
import { LoginPrompt } from "@/features/auth/components/login-prompt";
import { readParamValue } from "@/features/navigation/routes";
import { useAuthStore } from "@/stores/auth";
import { useInviteStore } from "@/stores/invite";

import { InviteAcceptScreen } from "./invite-accept-screen";

import { useLocalSearchParams } from "expo-router";

function InviteEntryScreen() {
  const params = useLocalSearchParams<{
    folderId?: string | string[];
    token?: string | string[];
  }>();
  const paramFolderId = readParamValue(params.folderId);
  const paramToken = readParamValue(params.token);

  const authHasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = authHasHydrated && Boolean(accessToken);

  const pending = useInviteStore((state) => state.pending);
  const setPending = useInviteStore((state) => state.setPending);
  const clearPending = useInviteStore((state) => state.clearPending);

  // Persist the invite the moment we land here so it survives the OAuth full-page
  // redirect on web (the /invite URL is replaced by the provider callback at root).
  React.useEffect(() => {
    if (paramToken && paramFolderId) {
      setPending({ token: paramToken, folderId: paramFolderId });
    }
  }, [paramFolderId, paramToken, setPending]);

  const token = paramToken ?? pending?.token ?? null;
  const folderId = paramFolderId ?? pending?.folderId ?? null;

  // Keep the stored invite until the accept call actually succeeds — dropping it
  // on sign-in alone loses the invite whenever the accept fails, and the user has
  // no way back to it.

  if (!authHasHydrated) {
    return (
      <View className="flex-1 items-center justify-center bg-background">
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-background">
      <OpenInAppBanner
        folderId={folderId}
        token={token}
      />
      {isAuthenticated ? (
        <InviteAcceptScreen
          folderId={folderId}
          token={token}
          onAccepted={clearPending}
        />
      ) : (
        <LoginPrompt subtitle="초대를 수락하려면 먼저 로그인해 주세요 ✨" />
      )}
    </View>
  );
}

export { InviteEntryScreen };
