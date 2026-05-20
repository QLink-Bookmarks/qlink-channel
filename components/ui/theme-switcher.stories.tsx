import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { ThemeSwitcher } from "./theme-switcher";

type ThemeSwitcherStoryProps = {
  accent: "gray" | "pink" | "blue";
  mode: "light" | "dark";
};

function ThemeSwitcherStory({ accent, mode }: ThemeSwitcherStoryProps) {
  const [currentAccent, setCurrentAccent] = React.useState(accent);
  const [currentMode, setCurrentMode] = React.useState(mode);

  React.useEffect(() => {
    setCurrentAccent(accent);
  }, [accent]);

  React.useEffect(() => {
    setCurrentMode(mode);
  }, [mode]);

  return (
    <ThemeSwitcher
      accent={currentAccent}
      mode={currentMode}
      onAccentChange={setCurrentAccent}
      onModeToggle={() =>
        setCurrentMode((previousMode) => (previousMode === "light" ? "dark" : "light"))
      }
    />
  );
}

const meta = {
  title: "공통 UI/테마 전환",
  component: ThemeSwitcherStory,
  argTypes: {
    accent: { control: "select", options: ["gray", "pink", "blue"] },
    mode: { control: "select", options: ["light", "dark"] },
  },
  args: {
    accent: "gray",
    mode: "light",
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-xs p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcherStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
