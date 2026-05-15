import "../global.css";

import { NAV_THEME } from "@/lib/theme";
import { QueryProvider } from "@/providers/query-provider";
import { ThemeProvider } from "@react-navigation/native";
import { PortalHost } from "@rn-primitives/portal";

import { Stack } from "expo-router";

const StorybookEnabled = process.env.EXPO_PUBLIC_STORYBOOK_ENABLED === "true";

export const unstable_settings = {
  initialRouteName: StorybookEnabled ? "(storybook)/index" : "(pages)/index",
};

export default function RootLayout() {
  const colorScheme = "light";

  return (
    <QueryProvider>
      <ThemeProvider value={NAV_THEME[colorScheme]}>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Protected guard={StorybookEnabled}>
            <Stack.Screen name="(storybook)/index" />
          </Stack.Protected>

          <Stack.Screen name="(pages)/index" />
        </Stack>
        <PortalHost />
      </ThemeProvider>
    </QueryProvider>
  );
}
