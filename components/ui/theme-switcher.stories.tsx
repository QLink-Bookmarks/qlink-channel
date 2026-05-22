import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { ThemeSwitcher, type ThemeSwitcherVariant } from "./theme-switcher";

type ThemeSwitcherStoryProps = {
  accent: "gray" | "pink" | "blue";
  mode: "light" | "dark";
  variant: ThemeSwitcherVariant;
};

function ThemeSwitcherStory({ accent, mode, variant }: ThemeSwitcherStoryProps) {
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
      variant={variant}
      onAccentChange={setCurrentAccent}
      onModeChange={setCurrentMode}
    />
  );
}

const meta = {
  title: "공통 UI/테마 전환",
  component: ThemeSwitcherStory,
  argTypes: {
    accent: { control: "select", options: ["gray", "pink", "blue"] },
    mode: { control: "select", options: ["light", "dark"] },
    variant: { control: "select", options: ["icon-buttons", "switch"] },
  },
  args: {
    accent: "gray",
    mode: "light",
    variant: "icon-buttons",
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

export const SwitchVariant: Story = {
  name: "스위치 안",
  args: {
    variant: "switch",
  },
};
