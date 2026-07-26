import { View } from "react-native";

import { Button } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { Text } from "@/components/ui/text";

import { useDeviceNotificationStatus } from "../hooks/use-device-notification-status";

import { BellOff } from "lucide-react-native/icons";

type DeviceNotificationNoticeProps = {
  enabledMessage?: string;
};

function DeviceNotificationNotice({ enabledMessage }: DeviceNotificationNoticeProps) {
  const { isEnabled, enable } = useDeviceNotificationStatus();

  // Hide while loading (null). Once enabled (true) the notice is done, but callers can
  // pass enabledMessage to confirm the grant in place instead of leaving a blank slot.
  if (isEnabled === null) {
    return null;
  }

  if (isEnabled) {
    if (!enabledMessage) {
      return null;
    }
    return (
      <Text className="text-center text-[15px] font-semibold text-foreground">
        {enabledMessage}
      </Text>
    );
  }

  return (
    <View className="flex-row items-center gap-3">
      <Icon
        as={BellOff}
        size={20}
        className="text-muted-foreground"
      />
      <View className="min-w-0 flex-1 gap-1">
        <Text className="text-sm font-semibold text-foreground">
          이 기기에서 알림이 꺼져 있어요
        </Text>
        <Text className="text-xs text-muted-foreground">알림을 받으려면 기기 알림을 켜주세요.</Text>
      </View>
      <Button
        size="sm"
        onPress={enable}
      >
        <Text>기기 알림 켜기</Text>
      </Button>
    </View>
  );
}

export { DeviceNotificationNotice };
