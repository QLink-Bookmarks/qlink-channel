import * as React from "react";
import { View } from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { Text } from "@/components/ui/text";
import { getMyProfile } from "@/features/account/api";
import { useAuthStore } from "@/stores/auth";
import { useDisplaySettings } from "@/stores/display-settings";

import { useCycledBrandColors } from "../hooks/use-cycled-brand-colors";
import { useOauthRedirect } from "../hooks/use-oauth-redirect";
import { LoginButtonsStack } from "./login-buttons";

import { type Href, useFocusEffect, useRouter } from "expo-router";

type AuthCheckStatus = "checking" | "authenticated" | "unauthenticated";

function AuthSplashScreen() {
  const router = useRouter();
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const [status, setStatus] = React.useState<AuthCheckStatus>("checking");

  // Handles the web OAuth `?code=` redirect for any provider (Kakao/Naver).
  useOauthRedirect();

  React.useEffect(() => {
    if (!hasHydrated) return;
    if (!accessToken) {
      setStatus("unauthenticated");
      return;
    }
    let cancelled = false;
    setStatus("checking");
    getMyProfile()
      .then((response) => {
        if (cancelled) return;
        if (response?.success && response.data) {
          setStatus("authenticated");
        } else {
          setStatus("unauthenticated");
        }
      })
      .catch(() => {
        if (cancelled) return;
        setStatus("unauthenticated");
      });
    return () => {
      cancelled = true;
    };
  }, [accessToken, hasHydrated]);

  useFocusEffect(
    React.useCallback(() => {
      if (status === "authenticated") {
        router.replace("/home" as Href);
      }
    }, [router, status]),
  );

  if (status === "unauthenticated") {
    return <UnauthenticatedScreen />;
  }
  return <CheckingScreen />;
}

function CheckingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-background px-6">
      <Text className="text-center text-2xl text-muted-foreground">인증 정보를 확인 중입니다…</Text>
    </View>
  );
}

function UnauthenticatedScreen() {
  const theme = useDisplaySettings((state) => state.display.theme);
  const colors = useCycledBrandColors(theme);

  return (
    <View className="flex-1 items-center justify-center gap-12 bg-background px-6 py-12">
      <View className="items-center gap-3">
        <BrandHeader
          size="xl"
          align="center"
          colors={colors}
        />
        <Text className="text-center text-lg text-muted-foreground">
          링크와 QR을 AI가 정리해주는 스마트 북마크 ✨
        </Text>
      </View>
      <LoginButtonsStack />
    </View>
  );
}

export { AuthSplashScreen };
