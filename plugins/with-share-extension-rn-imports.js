const { withMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

module.exports = function withShareExtensionRnImports(config) {
  return withMod(config, {
    platform: "ios",
    mod: "finalized",
    action: (config) => {
      const iosDir = config.modRequest.platformProjectRoot;
      for (const entry of fs.readdirSync(iosDir)) {
        if (!entry.endsWith("ShareExtension")) continue;
        const swiftPath = path.join(iosDir, entry, "ShareExtensionViewController.swift");
        if (!fs.existsSync(swiftPath)) continue;
        let contents = fs.readFileSync(swiftPath, "utf8");
        if (contents.includes("#if canImport(React_RCTAppDelegate)")) continue;
        contents = contents.replace(
          /^import React_RCTAppDelegate$/m,
          "#if canImport(React_RCTAppDelegate)\nimport React_RCTAppDelegate\n#endif",
        );
        fs.writeFileSync(swiftPath, contents);
      }
      return config;
    },
  });
};
