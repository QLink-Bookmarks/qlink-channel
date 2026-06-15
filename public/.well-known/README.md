# Universal Links / App Links (invite deep linking)

These files let `https://<web-host>/invite?...` open the native app directly instead of the
browser. They are served from the web build root (`public/` → `/.well-known/...`).

Activation checklist (none of this requires a paid Expo plan):

1. Set `EXPO_PUBLIC_WEB_APP_HOST` (e.g. `app.qlinkapps.com`) so `app.config.ts` emits
   `ios.associatedDomains` + `android.intentFilters`.
2. `apple-app-site-association` — replace `TEAMID` with the Apple Developer Team ID
   (Membership page). Must be served at `https://<host>/.well-known/apple-app-site-association`
   with `Content-Type: application/json` and **no** redirect.
3. `assetlinks.json` — replace `REPLACE_WITH_SHA256_FINGERPRINT` with the release signing
   key's SHA-256 fingerprint (`keytool -list -v -keystore <release.keystore>`, or from
   `eas credentials`). Multiple fingerprints (debug + release) can be listed.
4. Rebuild the native app (EAS Build free tier or `expo prebuild`) so the new
   entitlements/intent-filters ship.

Until then, the web invite page falls back to the custom-scheme "앱에서 열기" interstitial
(`qlinkchannel://invite?...`).
