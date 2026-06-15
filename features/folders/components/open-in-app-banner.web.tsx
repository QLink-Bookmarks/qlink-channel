import * as React from "react";
import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { ExternalLink, X } from "lucide-react-native/icons";

const APP_SCHEME = "qlinkchannel";

type OpenInAppBannerProps = {
  token?: string | null;
  folderId?: string | null;
};

function isMobileWeb() {
  if (typeof navigator === "undefined") {
    return false;
  }
  return /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
}

function OpenInAppBanner({ token, folderId }: OpenInAppBannerProps) {
  const [dismissed, setDismissed] = React.useState(false);
  const [isMobile] = React.useState(isMobileWeb);

  if (dismissed || !isMobile || !token || !folderId) {
    return null;
  }

  const handleOpenApp = () => {
    const params = `token=${encodeURIComponent(token)}&folderId=${encodeURIComponent(folderId)}`;
    // Custom-scheme deep link. If the app is installed the OS hands off to it;
    // otherwise this no-ops and the user stays on the web invite flow.
    window.location.href = `${APP_SCHEME}://invite?${params}`;
  };

  return (
    <View className="flex-row items-center gap-3 border-b border-border bg-card px-4 py-3">
      <View className="flex-1">
        <Text className="text-sm font-semibold text-foreground">앱에서 열기</Text>
        <Text className="text-xs text-muted-foreground">
          앱이 설치되어 있다면 앱에서 이어가세요.
        </Text>
      </View>
      <Button
        size="sm"
        variant="gradient"
        onPress={handleOpenApp}
      >
        <Icon
          as={ExternalLink}
          size={14}
          className="text-primary-foreground"
        />
        <Text>앱으로</Text>
      </Button>
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
  );
}

export { OpenInAppBanner };
export type { OpenInAppBannerProps };
