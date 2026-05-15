import { useState } from "react";
import { Text, View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { RadioGroup, RadioGroupItem } from "./radio-group";

import { fn } from "storybook/test";

type RadioGroupProps = React.ComponentProps<typeof RadioGroup>;

const options = [
  { value: "email", label: "Email" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "Push notification" },
];

function RadioGroupDemo(args: RadioGroupProps) {
  const [value, setValue] = useState(args.value ?? "email");

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    args.onValueChange(nextValue);
  };

  return (
    <View className="gap-4 p-4">
      <RadioGroup
        {...args}
        value={value}
        onValueChange={handleValueChange}
      >
        {options.map((option) => (
          <View
            key={option.value}
            className="flex-row items-center gap-3"
          >
            <RadioGroupItem
              value={option.value}
              aria-labelledby={`${option.value}-label`}
            />
            <Text
              nativeID={`${option.value}-label`}
              className="text-base text-foreground"
            >
              {option.label}
            </Text>
          </View>
        ))}
      </RadioGroup>

      <Text className="text-sm text-muted-foreground">Selected: {value}</Text>
    </View>
  );
}

const meta = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  args: {
    value: "email",
    onValueChange: fn(),
    disabled: false,
  },
  render: (args) => <RadioGroupDemo {...args} />,
} satisfies Meta<typeof RadioGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
