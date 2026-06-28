import { OnboardingScreen } from "@/features/onboarding/components/onboarding-screen";
import { useOnboardingStore } from "@/stores/onboarding";

import { type Href, useRouter } from "expo-router";

export default function OnboardingRoute() {
  const router = useRouter();
  const complete = useOnboardingStore((state) => state.complete);

  const handleDone = () => {
    complete();
    router.replace("/" as Href);
  };

  return <OnboardingScreen onDone={handleDone} />;
}
