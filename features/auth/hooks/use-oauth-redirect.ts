// Native has no browser redirect to process — the native SDKs resolve tokens
// directly. This is the no-op counterpart to use-oauth-redirect.web.ts.
function useOauthRedirect() {
  return { isProcessing: false };
}

export { useOauthRedirect };
