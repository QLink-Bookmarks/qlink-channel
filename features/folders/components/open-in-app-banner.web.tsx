import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";
import { getAppVariant } from "@/lib/app-variant";

import { X } from "lucide-react-native/icons";

const APP_SCHEME = "qlinkchannel";

type MobilePlatform = "ios" | "android" | null;

type OpenInAppBannerProps = {
  token?: string | null;
  folderId?: string | null;
};

function detectMobilePlatform(): MobilePlatform {
  if (typeof navigator === "undefined") {
    return null;
  }
  if (/iPhone|iPad|iPod/i.test(navigator.userAgent)) {
    return "ios";
  }
  if (/Android/i.test(navigator.userAgent)) {
    return "android";
  }
  return null;
}

function getStoreUrl(platform: MobilePlatform): string | undefined {
  if (platform === "ios") {
    return process.env.EXPO_PUBLIC_IOS_APP_STORE_URL || undefined;
  }
  if (platform === "android") {
    return process.env.EXPO_PUBLIC_ANDROID_PLAY_STORE_URL || undefined;
  }
  return undefined;
}

function OpenInAppBanner({ token, folderId }: OpenInAppBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [platform] = React.useState(detectMobilePlatform);
  const storeUrl = getStoreUrl(platform);
  const isProduction = getAppVariant() === "production";

  if (dismissed || !platform || !token || !folderId) {
    return null;
  }
  // Outside production, always surface the banner so testers can hand off to the
  // app even without a published store listing. In production keep it gated on a
  // store URL, otherwise "open in app" is a dead end for users without the app.
  if (isProduction && !storeUrl) {
    return null;
  }

  const deepLink = `${APP_SCHEME}://invite?token=${encodeURIComponent(
    token,
  )}&folderId=${encodeURIComponent(folderId)}`;

  // Try to hand off to the installed app. If the page never backgrounds (app not
  // installed), fall back to the store, or tell the user no app is installed.
  const handleOpenApp = () => {
    let backgrounded = false;
    const onVisibilityChange = () => {
      if (document.hidden) {
        backgrounded = true;
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.location.href = deepLink;

    window.setTimeout(() => {
      document.removeEventListener("visibilitychange", onVisibilityChange);
      if (!backgrounded && !document.hidden) {
        if (storeUrl) {
          window.location.href = storeUrl;
        } else {
          window.alert("설치된 앱이 없어요. 개발자에게 문의해주세요.");
        }
      }
    }, 1500);
  };

  return (
    <View className="gap-3 border-b border-border bg-card px-4 py-3">
      <View className="flex-row items-center gap-3">
        <View className="flex-1">
          <Text className="text-sm font-semibold text-foreground">앱에서 열기</Text>
          <Text className="text-xs text-muted-foreground">
            {storeUrl
              ? "앱이 있으면 앱에서, 없으면 스토어에서 이어가세요."
              : "앱이 설치돼 있으면 앱에서 이어가세요."}
          </Text>
        </View>
        <Button
          accessibilityLabel="배너 닫기"
          size="icon"
          variant="ghost"
          onPress={() => setDismissed(true)}
        >
          <Icon
            as={X}
            size={16}
            className="text-muted-foreground"
          />
        </Button>
      </View>
      <Button
        size="sm"
        variant="gradient"
        onPress={handleOpenApp}
      >
        <Text>앱에서 열기</Text>
      </Button>
    </View>
  );
}

export { OpenInAppBanner };
export type { OpenInAppBannerProps };
