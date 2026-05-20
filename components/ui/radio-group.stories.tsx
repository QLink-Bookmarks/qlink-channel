import { useState } from "react";
import { Text, View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { RadioGroup, RadioGroupItem } from "./radio-group";

const options = [
  { value: "email", label: "이메일" },
  { value: "sms", label: "SMS" },
  { value: "push", label: "푸시 알림" },
];

type RadioGroupStoryProps = {
  value: string;
  disabled: boolean;
};

function RadioGroupDemo({ value: initialValue, disabled }: RadioGroupStoryProps) {
  const [value, setValue] = useState(initialValue);

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
  };

  return (
    <View className="gap-4 p-4">
      <RadioGroup
        value={value}
        disabled={disabled}
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

      <Text className="text-sm text-muted-foreground">선택됨: {value}</Text>
    </View>
  );
}

const meta = {
  title: "공통 UI/라디오 그룹",
  component: RadioGroupDemo,
  args: {
    value: "email",
    disabled: false,
  },
  argTypes: {
    value: { control: "select", options: ["email", "sms", "push"] },
    disabled: { control: "boolean" },
  },
  render: (args) => <RadioGroupDemo {...args} />,
} satisfies Meta<typeof RadioGroupDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Disabled: Story = {
  name: "비활성",
  args: {
    disabled: true,
  },
};
