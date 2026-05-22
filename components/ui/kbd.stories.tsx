import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Kbd } from "./kbd";

type KbdStoryProps = {
  value: string;
  label?: string;
  size: "xs" | "sm";
  variant: "default" | "inverse";
  labelPosition: "left" | "right";
};

function KbdStory({ value, label, size, variant, labelPosition }: KbdStoryProps) {
  return (
    <Kbd
      size={size}
      variant={variant}
      label={label}
      labelPosition={labelPosition}
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
    variant: "default",
    labelPosition: "right",
  },
  argTypes: {
    value: { control: "text" },
    label: { control: "text" },
    size: { control: "select", options: ["xs", "sm"] },
    variant: { control: "select", options: ["default", "inverse"] },
    labelPosition: { control: "select", options: ["left", "right"] },
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
      <Kbd
        label="닫기"
        labelPosition="left"
      >
        Esc
      </Kbd>
      <Kbd size="xs">Esc</Kbd>
      <Kbd
        variant="inverse"
        label="검색"
      >
        ⌘K
      </Kbd>
    </>
  ),
};
