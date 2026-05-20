import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { LinearGradient } from "./linear-gradient";
import { Text } from "./text";

const meta = {
  title: "공통 UI/선형 그라디언트",
  component: LinearGradient,
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
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LinearGradient>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: (args) => (
    <LinearGradient
      {...args}
      className="h-24 items-center justify-center rounded-2xl"
    >
      <Text className="font-semibold text-white">그라디언트</Text>
    </LinearGradient>
  ),
};
