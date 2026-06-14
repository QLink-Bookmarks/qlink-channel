const { withDangerousMod } = require("@expo/config-plugins");
const fs = require("fs");
const path = require("path");

// GoogleSignIn (a Swift pod) pulls AppCheckCore/GoogleUtilities/RecaptchaInterop,
// which don't define modules and so can't be imported from a Swift static library.
// Opt every pod into module maps, as the CocoaPods error recommends.
module.exports = function withIosModularHeaders(config) {
  return withDangerousMod(config, [
    "ios",
    (config) => {
      const podfilePath = path.join(config.modRequest.platformProjectRoot, "Podfile");
      let contents = fs.readFileSync(podfilePath, "utf8");
      if (!contents.includes("use_modular_headers!")) {
        contents = contents.replace(/(platform :ios[^\n]*\n)/, "$1use_modular_headers!\n");
        fs.writeFileSync(podfilePath, contents);
      }
      return config;
    },
  ]);
};
