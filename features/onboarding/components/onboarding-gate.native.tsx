import { OnboardingScreen } from "./onboarding-screen";

function OnboardingGate({ onDone }: { onDone: () => void }) {
  return <OnboardingScreen onDone={onDone} />;
}

export { OnboardingGate };
