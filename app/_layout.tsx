import "../global.css";

import * as React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, initialWindowMetrics } from "react-native-safe-area-context";

import { getNavTheme } from "@/lib/theme";
import { QueryProvider } from "@/providers/query-provider";
import { useDisplaySettings } from "@/stores/display-settings";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";

import { Stack } from "expo-router";

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? "(storybook)/index" : "(pages)",
};

function DisplayThemeBridge() {
  const theme = useDisplaySettings((state) => state.display.theme);
  const accent = useDisplaySettings((state) => state.display.accent);

  React.useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.setAttribute("data-accent", accent);
  }, [accent, theme]);

  return null;
}

export default function RootLayout() {
  const theme = useDisplaySettings((state) => state.display.theme);
  const accent = useDisplaySettings((state) => state.display.accent);

  return (
    <GestureHandlerRootView className={theme === "dark" ? "dark flex-1" : "flex-1"}>
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <QueryProvider>
          <DisplayThemeBridge />
          <ThemeProvider value={getNavTheme(theme, accent)}>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Protected guard={StorybookEnabled}>
                <Stack.Screen name="(storybook)/index" />
              </Stack.Protected>

              <Stack.Screen name="(pages)" />
            </Stack>
            <PortalHost />
          </ThemeProvider>
        </QueryProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
