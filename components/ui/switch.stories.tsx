import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Switch } from "./switch";
import { Text } from "./text";

import { fn } from "storybook/test";

function SwitchDemo({
  checked: initialChecked = true,
  disabled = false,
  onCheckedChange = fn(),
}: React.ComponentProps<typeof Switch>) {
  const [checked, setChecked] = React.useState(initialChecked);

  const handleCheckedChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
    onCheckedChange(nextChecked);
  };

  return (
    <View className="flex-row items-center gap-3 p-4">
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
      />
      <Text>Enable notifications</Text>
    </View>
  );
}

const meta = {
  title: "UI/Switch",
  component: Switch,
  args: {
    checked: true,
    disabled: false,
    onCheckedChange: fn(),
  },
  render: (args) => <SwitchDemo {...args} />,
} satisfies Meta<typeof Switch>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
