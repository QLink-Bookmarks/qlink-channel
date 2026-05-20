import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Progress } from "./progress";
import { Text } from "./text";

const meta = {
  title: "공통 UI/진행률",
  component: Progress,
  args: {
    value: 64,
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Progress>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: (args) => (
    <>
      <Progress {...args} />
      <Text variant="muted">{args.value}% 완료</Text>
    </>
  ),
};
