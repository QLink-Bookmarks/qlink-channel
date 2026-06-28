// Base (web + fallback): ships no onboarding. Keeps OnboardingScreen out of the
// web bundle entirely; native uses onboarding-gate.native.tsx instead.
function OnboardingGate(_props: { onDone: () => void }) {
  return null;
}

export { OnboardingGate };
