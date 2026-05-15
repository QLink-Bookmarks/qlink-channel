import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Checkbox } from "./checkbox";
import { Text } from "./text";

import { fn } from "storybook/test";

function CheckboxDemo({
  checked: initialChecked = true,
  disabled = false,
  onCheckedChange = fn(),
}: React.ComponentProps<typeof Checkbox>) {
  const [checked, setChecked] = React.useState(initialChecked);

  const handleCheckedChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    onCheckedChange(nextChecked);
  };

  return (
    <View className="flex-row items-center gap-3 p-4">
      <Checkbox
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
      />
      <Text>Accept notifications</Text>
    </View>
  );
}

const meta = {
  title: "UI/Checkbox",
  component: Checkbox,
  args: {
    checked: true,
    disabled: false,
    onCheckedChange: fn(),
  },
  render: (args) => <CheckboxDemo {...args} />,
} satisfies Meta<typeof Checkbox>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
