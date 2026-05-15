import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Badge } from "./badge";
import { Text } from "./text";

const meta = {
  title: "UI/Badge",
  component: Badge,
  decorators: [
    (Story) => (
      <View className="items-start p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Badge>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Badge>
      <Text>Default</Text>
    </Badge>
  ),
};

export const Variants: Story = {
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Badge>
        <Text>Default</Text>
      </Badge>
      <Badge variant="secondary">
        <Text>Secondary</Text>
      </Badge>
      <Badge variant="outline">
        <Text>Outline</Text>
      </Badge>
      <Badge variant="destructive">
        <Text>Destructive</Text>
      </Badge>
    </View>
  ),
};
