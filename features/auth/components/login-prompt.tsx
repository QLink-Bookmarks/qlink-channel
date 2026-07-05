import { View } from "react-native";

import { BrandHeader } from "@/components/layout/brand-header";
import { BrandLogo } from "@/components/layout/brand-logo";
import { Text } from "@/components/ui/text";
import { useDisplaySettings } from "@/stores/display-settings";

import { useCycledBrandColors } from "../hooks/use-cycled-brand-colors";
import { LoginButtonsStack } from "./login-buttons";

const DEFAULT_SUBTITLE = "AI가 도와주는 북마크 아카이브 ✨";

function LoginPrompt({ subtitle = DEFAULT_SUBTITLE }: { subtitle?: string }) {
  const theme = useDisplaySettings((state) => state.display.theme);
  const colors = useCycledBrandColors(theme);

  return (
    <View className="flex-1 items-center justify-center gap-12 bg-background px-6 py-12">
      <View className="items-center gap-3">
        <View className="items-center gap-2">
          <BrandLogo size={72} />
          <BrandHeader
            size="xl"
            align="center"
            colors={colors}
          />
        </View>
        <Text className="text-center text-lg text-muted-foreground">{subtitle}</Text>
      </View>
      <LoginButtonsStack />
    </View>
  );
}

export { LoginPrompt };
