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

const options = [
  { value: "starter", label: "스타터" },
  { value: "team", label: "팀" },
  { value: "enterprise", label: "엔터프라이즈" },
];

type SelectStoryProps = {
  value: "starter" | "team" | "enterprise";
  disabled: boolean;
};

function SelectDemo({ value: initialValue = "team", disabled = false }: SelectStoryProps) {
  const initialOption = options.find((option) => option.value === initialValue) ?? options[1];
  const [value, setValue] = React.useState<Option>(initialOption);

  React.useEffect(() => {
    setValue(options.find((option) => option.value === initialValue) ?? options[1]);
  }, [initialValue]);

  const handleValueChange = (nextValue: Option) => {
    setValue(nextValue);
  };

  return (
    <Select
      value={value}
      disabled={disabled}
      onValueChange={handleValueChange}
    >
      <SelectTrigger
        className="w-56"
        disabled={disabled}
      >
        <SelectValue placeholder="플랜 선택" />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          <SelectLabel>플랜</SelectLabel>
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
  title: "공통 UI/셀렉트",
  component: SelectDemo,
  args: {
    value: "team",
    disabled: false,
  },
  argTypes: {
    value: { control: "select", options: ["starter", "team", "enterprise"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="items-start p-4">
        <Story />
      </View>
    ),
  ],
  render: (args) => <SelectDemo {...args} />,
} satisfies Meta<typeof SelectDemo>;

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
