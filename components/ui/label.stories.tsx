import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "공통 UI/라벨",
  component: Label,
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Label>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: () => (
    <>
      <Label nativeID="project-label">프로젝트 이름</Label>
      <Input
        aria-labelledby="project-label"
        defaultValue="출시 계획"
      />
    </>
  ),
};

export const Disabled: Story = {
  name: "비활성",
  render: () => <Label disabled>비활성 라벨</Label>,
};
