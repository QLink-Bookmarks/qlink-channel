import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Switch } from "./switch";
import { Text } from "./text";

type SwitchStoryProps = {
  label: string;
  checked: boolean;
  disabled: boolean;
};

function SwitchDemo({ label, checked: initialChecked = true, disabled = false }: SwitchStoryProps) {
  const [checked, setChecked] = React.useState(initialChecked);

  React.useEffect(() => {
    setChecked(initialChecked);
  }, [initialChecked]);

  const handleCheckedChange = (nextChecked: boolean) => {
    setChecked(nextChecked);
  };

  return (
    <View className="flex-row items-center gap-3 p-4">
      <Switch
        checked={checked}
        disabled={disabled}
        onCheckedChange={handleCheckedChange}
      />
      <Text>{label}</Text>
    </View>
  );
}

const meta = {
  title: "공통 UI/스위치",
  component: SwitchDemo,
  args: {
    label: "알림 켜기",
    checked: true,
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    checked: { control: "boolean" },
    disabled: { control: "boolean" },
  },
  render: (args) => <SwitchDemo {...args} />,
} satisfies Meta<typeof SwitchDemo>;

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
