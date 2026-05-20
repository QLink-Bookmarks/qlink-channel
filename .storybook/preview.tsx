import "../global.css";

import { type ReactNode, useEffect } from "react";
import { View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import { PortalHost } from "@rn-primitives/portal";
import type { Preview } from "@storybook/react-native-web-vite";

import { INITIAL_VIEWPORTS } from "storybook/viewport";

type StorybookAccent = "gray" | "pink" | "blue";
type StorybookMode = "light" | "dark";

function ThemeRootDecorator({
  accent,
  mode,
  children,
}: {
  accent: StorybookAccent;
  mode: StorybookMode;
  children: ReactNode;
}) {
  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    const root = document.documentElement;

    root.classList.toggle("dark", mode === "dark");

    if (accent === "gray") {
      delete root.dataset.accent;
      return;
    }

    root.dataset.accent = accent;
  }, [accent, mode]);

  return children;
}

const preview: Preview = {
  globalTypes: {
    accent: {
      name: "강조 색상",
      description: "root data-accent에 적용되는 전체 디자인 토큰 accent",
      defaultValue: "gray",
      toolbar: {
        icon: "paintbrush",
        items: [
          { value: "gray", title: "회색" },
          { value: "pink", title: "분홍" },
          { value: "blue", title: "파랑" },
        ],
      },
    },
    mode: {
      name: "모드",
      description: "root dark class에 적용되는 light/dark mode",
      defaultValue: "light",
      toolbar: {
        icon: "circlehollow",
        items: [
          { value: "light", title: "라이트" },
          { value: "dark", title: "다크" },
        ],
      },
    },
  },

  parameters: {
    controls: {
      exclude: [/^className$/, /.*ClassName$/],
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },

    viewport: {
      options: INITIAL_VIEWPORTS,
    },

    docs: {
      story: {
        iframeHeight: 800,
      },
    },
  },

  initialGlobals: {
    accent: "gray",
    mode: "light",
    viewport: { value: "desktop", isRotated: false },
  },

  tags: ["autodocs"],

  decorators: [
    (Story, context) => {
      const accent = (context.globals.accent ?? "gray") as StorybookAccent;
      const mode = (context.globals.mode ?? "light") as StorybookMode;

      return (
        <ThemeRootDecorator
          accent={accent}
          mode={mode}
        >
          <GestureHandlerRootView className="flex-1">
            <View className="flex-1 bg-background">
              <Story />
              <PortalHost />
            </View>
          </GestureHandlerRootView>
        </ThemeRootDecorator>
      );
    },
  ],
};

export default preview;
