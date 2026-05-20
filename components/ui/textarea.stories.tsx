import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "공통 UI/텍스트 영역",
  component: Textarea,
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Textarea>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: () => (
    <>
      <Label>메모</Label>
      <Textarea placeholder="짧은 메모를 입력하세요..." />
    </>
  ),
};

export const Disabled: Story = {
  name: "비활성",
  render: () => (
    <Textarea
      editable={false}
      value="비활성 텍스트 영역"
    />
  ),
};
