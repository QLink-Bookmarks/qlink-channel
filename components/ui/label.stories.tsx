import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Input } from "./input";
import { Label } from "./label";

const meta = {
  title: "UI/Label",
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
  render: () => (
    <>
      <Label nativeID="project-label">Project name</Label>
      <Input
        aria-labelledby="project-label"
        defaultValue="Launch plan"
      />
    </>
  ),
};

export const Disabled: Story = {
  render: () => <Label disabled>Disabled label</Label>,
};
