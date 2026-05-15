import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Text } from "./text";

import { fn } from "storybook/test";

const meta = {
  title: "UI/Button",
  component: Button,
  args: {
    onPress: fn(),
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Button>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: (args) => (
    <Button {...args}>
      <Text>Button</Text>
    </Button>
  ),
};

export const Variants: Story = {
  render: (args) => (
    <View className="items-start gap-3">
      <Button {...args}>
        <Text>Default</Text>
      </Button>
      <Button
        {...args}
        variant="secondary"
      >
        <Text>Secondary</Text>
      </Button>
      <Button
        {...args}
        variant="outline"
      >
        <Text>Outline</Text>
      </Button>
      <Button
        {...args}
        variant="destructive"
      >
        <Text>Destructive</Text>
      </Button>
      <Button
        {...args}
        variant="ghost"
      >
        <Text>Ghost</Text>
      </Button>
      <Button
        {...args}
        variant="link"
      >
        <Text>Link</Text>
      </Button>
    </View>
  ),
};
