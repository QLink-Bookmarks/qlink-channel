import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { MemberChip } from "./member-chip";

const meta = {
  title: "공통 UI/멤버 칩",
  component: MemberChip,
  args: {
    name: "송인재",
  },
  decorators: [
    (Story) => (
      <View className="flex-row gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof MemberChip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  args: {
    name: "송인재",
  },
  render: () => (
    <>
      <MemberChip name="송인재" />
      <MemberChip
        name="삭제 가능한 멤버"
        removable
      />
    </>
  ),
};
