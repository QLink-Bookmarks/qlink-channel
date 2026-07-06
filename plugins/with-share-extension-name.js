const { withMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// The share-sheet label users see is the extension appex's CFBundleDisplayName.
// expo-share-extension hardcodes it to "$(PRODUCT_NAME) Share Extension"
// (e.g. "QLinkShareExtension Share Extension"), which leaks the old QLink name.
// Force it to the app's Korean display name so the share sheet reads "에이링크".
const EXTENSION_DISPLAY_NAME = "에이링크";

module.exports = function withShareExtensionName(config) {
  return withMod(config, {
    platform: "ios",
    mod: "finalized",
    action: (config) => {
      const iosDir = config.modRequest.platformProjectRoot;
      for (const entry of fs.readdirSync(iosDir)) {
        if (!entry.endsWith("ShareExtension")) continue;
        const plistPath = path.join(iosDir, entry, "Info.plist");
        if (!fs.existsSync(plistPath)) continue;
        let contents = fs.readFileSync(plistPath, "utf8");
        contents = contents.replace(
          /(<key>CFBundleDisplayName<\/key>\s*<string>)[^<]*(<\/string>)/,
          `$1${EXTENSION_DISPLAY_NAME}$2`,
        );
        fs.writeFileSync(plistPath, contents);
      }
      return config;
    },
  });
};
