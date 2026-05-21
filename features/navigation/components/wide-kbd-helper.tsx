import { View } from "react-native";

import { Kbd } from "@/components/ui/kbd";
import { Text } from "@/components/ui/text";

function WideKbdHelper() {
  return (
    <View className="bg-card/92 absolute bottom-6 right-6 z-fixed flex-row items-center gap-4 rounded-full border border-border-soft px-5 py-3 shadow-qlink-md">
      <View className="flex-row items-center gap-2">
        <Kbd
          label="검색"
          labelPosition="right"
        >
          ⌘/Ctrl + K
        </Kbd>
      </View>
      <View className="h-4 w-px bg-background/20" />
      <View className="flex-row items-center gap-2">
        <Kbd
          label="새 링크"
          labelPosition="right"
        >
          N
        </Kbd>
      </View>
      <Text className="sr-only">와이드뷰 키보드 단축키 안내</Text>
    </View>
  );
}

export { WideKbdHelper };
