import { Pressable } from "react-native";

import { Text } from "@/components/ui/text";
import { useOnboardingStore } from "@/stores/onboarding";

// Dev utility: clears the persisted onboarding flag so the splash re-renders the
// OnboardingGate. Native-only (web ships no onboarding) — see the .web no-op.
function ReplayOnboardingButton() {
  const resetOnboarding = useOnboardingStore((state) => state.reset);

  return (
    <Pressable
      className="h-12 w-full flex-row items-center justify-center rounded-xl border border-border px-4 active:opacity-70"
      onPress={resetOnboarding}
    >
      <Text className="text-base font-medium text-muted-foreground">(개발용) 온보딩 다시보기</Text>
    </Pressable>
  );
}

export { ReplayOnboardingButton };
