import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Label } from "./label";
import { Textarea } from "./textarea";

const meta = {
  title: "UI/Textarea",
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
  render: () => (
    <>
      <Label>Notes</Label>
      <Textarea placeholder="Write a short note..." />
    </>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Textarea
      editable={false}
      value="Disabled textarea"
    />
  ),
};
