import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { AccountRow } from "./account-row";

const meta = {
  title: "기능/계정/계정 행",
  component: AccountRow,
  parameters: {
    docs: {
      description: {
        component: "모바일 전용 계정 설정 행이다. md 이상에서는 사용하지 않는다.",
      },
    },
  },
  args: {
    label: "이메일",
    value: "injae@example.com",
    actionLabel: "변경",
    destructive: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    actionLabel: { control: "text" },
    destructive: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="max-w-md gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AccountRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
