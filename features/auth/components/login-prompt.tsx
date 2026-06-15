import { View } from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { Text } from "@/components/ui/text";
import { useDisplaySettings } from "@/stores/display-settings";

import { useCycledBrandColors } from "../hooks/use-cycled-brand-colors";
import { LoginButtonsStack } from "./login-buttons";

const DEFAULT_SUBTITLE = "링크와 QR을 AI가 정리해주는 스마트 북마크 ✨";

function LoginPrompt({ subtitle = DEFAULT_SUBTITLE }: { subtitle?: string }) {
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
        <Text className="text-center text-lg text-muted-foreground">{subtitle}</Text>
      </View>
      <LoginButtonsStack />
    </View>
  );
}

export { LoginPrompt };
