declare module "@react-native-masked-view/masked-view" {
  import * as React from "react";
  import type { ViewProps } from "react-native";

  type MaskedViewProps = ViewProps & {
    maskElement: React.ReactElement;
    androidRenderingMode?: "software" | "hardware";
  };

  const MaskedView: React.ComponentType<MaskedViewProps>;

  export default MaskedView;
}
