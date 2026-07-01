import { useAuthStore } from "@/stores/auth";

import { LoginPrompt } from "./login-prompt";

import { type Href, Redirect } from "expo-router";

// Dedicated /login route. Native reaches login both at "/" (auth splash) and
// here; web sends landing visitors here from the "웹으로 시작하기" CTA. Already
// signed in? Bounce to root so the splash routes to the right place.
function LoginRouteScreen() {
  const hasHydrated = useAuthStore((state) => state.hasHydrated);
  const accessToken = useAuthStore((state) => state.accessToken);

  if (hasHydrated && accessToken) {
    return <Redirect href={"/" as Href} />;
  }

  return <LoginPrompt />;
}

export { LoginRouteScreen };
