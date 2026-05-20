import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Kbd } from "./kbd";

type KbdStoryProps = {
  value: string;
  label?: string;
  size: "xs" | "sm";
};

function KbdStory({ value, label, size }: KbdStoryProps) {
  return (
    <Kbd
      size={size}
      label={label}
    >
      {value}
    </Kbd>
  );
}

const meta = {
  title: "공통 UI/키보드 단축키",
  component: KbdStory,
  args: {
    value: "N",
    label: "새 링크",
    size: "sm",
  },
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    size: { control: "select", options: ["xs", "sm"] },
  },
  decorators: [
    (Story) => (
      <View className="flex-row gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof KbdStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Examples: Story = {
  name: "예시",
  render: () => (
    <>
      <Kbd>Ctrl</Kbd>
      <Kbd label="새 링크">N</Kbd>
      <Kbd size="xs">Esc</Kbd>
    </>
  ),
};
