import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Checkbox } from "./checkbox";
import { Text } from "./text";

import { useArgs } from "storybook/preview-api";

type CheckboxStoryProps = {
  label: string;
  checked: boolean;
  disabled: boolean;
  shape: "square" | "round";
};

function CheckboxDemo({
  label,
  checked: initialChecked = true,
  disabled = false,
  shape = "square",
}: CheckboxStoryProps) {
  const [checked, setChecked] = React.useState(initialChecked);

  const handleCheckedChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
  };

  return (
    <View className="flex-row items-center gap-3 p-4">
      <Checkbox
        checked={checked}
        disabled={disabled}
        shape={shape}
        onCheckedChange={handleCheckedChange}
      />
      <Text>{label}</Text>
    </View>
  );
}

const meta = {
  title: "공통 UI/체크박스",
  component: CheckboxDemo,
  args: {
    label: "알림 받기",
    checked: true,
    disabled: false,
    shape: "square",
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
    shape: { control: "select", options: ["square", "round"] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <View className="flex-row items-center gap-3 p-4">
        <Checkbox
          checked={args.checked}
          disabled={args.disabled}
          shape={args.shape}
          onCheckedChange={(nextChecked) => updateArgs({ checked: nextChecked })}
        />
        <Text>{args.label}</Text>
      </View>
    );
  },
} satisfies Meta<typeof CheckboxDemo>;

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
