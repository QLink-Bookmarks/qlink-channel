import { Image } from "expo-image";

// Transparent 3D "A" brand mark, shown above the ALINK wordmark on the login and
// landing hero screens.
const LOGO = require("../../assets/brand-logo.png");

function BrandLogo({ size = 72 }: { size?: number }) {
  return (
    <Image
      source={LOGO}
      contentFit="contain"
      accessibilityLabel="ALink"
      style={{ width: size, height: size }}
    />
  );
}

export { BrandLogo };
