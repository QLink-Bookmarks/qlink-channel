import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Input",
  component: Input,
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Input>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <>
      <Label>Email</Label>
      <Input
        placeholder="name@example.com"
        keyboardType="email-address"
      />
    </>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Input
      editable={false}
      value="Disabled input"
    />
  ),
};
