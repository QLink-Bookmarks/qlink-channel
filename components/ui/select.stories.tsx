import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "./select";

import { fn } from "storybook/test";

const options = [
  { value: "starter", label: "Starter" },
  { value: "team", label: "Team" },
  { value: "enterprise", label: "Enterprise" },
];

function SelectDemo({
  value: initialValue = options[1],
  disabled = false,
  onValueChange = fn(),
}: React.ComponentProps<typeof Select>) {
  const [value, setValue] = React.useState<Option>(initialValue);

  const handleValueChange = (nextValue: Option) => {
    setValue(nextValue);
    onValueChange(nextValue);
  };

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a plan" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>Plans</SelectLabel>
          {options.map((option) => (
            <SelectItem
              key={option.value}
              value={option.value}
              label={option.label}
            />
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  );
}

const meta = {
  title: "UI/Select",
  component: Select,
  args: {
    value: options[1],
    disabled: false,
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <View className="items-start p-4">
        <Story />
      </View>
    ),
  ],
  render: (args) => <SelectDemo {...args} />,
} satisfies Meta<typeof Select>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
