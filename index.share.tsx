import "./global.css";

import { AppRegistry, View } from "react-native";

import { DEFAULT_ACCENT } from "@/lib/theme";
import { getNativeThemeVars } from "@/lib/theme-vars";

import { ShareSheet } from "./share/share-sheet";

import { vars } from "nativewind";

function ShareExtension(props: { url?: string; text?: string; preprocessingResults?: unknown }) {
  const themeVars = vars(getNativeThemeVars("light", DEFAULT_ACCENT));
  return (
    <View
      style={[{ flex: 1 }, themeVars]}
      className="flex-1 bg-background"
    >
      <ShareSheet {...props} />
    </View>
  );
}

AppRegistry.registerComponent("shareExtension", () => ShareExtension);
