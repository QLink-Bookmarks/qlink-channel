import type { ConnectedAuthProvider } from "@/features/account/types";

// Native Naver SDK has no web counterpart here, so this is a no-op on web.
async function logoutNaver(_connectedProviders: ConnectedAuthProvider[]) {}

export { logoutNaver };
