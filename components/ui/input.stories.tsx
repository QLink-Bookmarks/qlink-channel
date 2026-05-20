import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Input } from "./input";
import { Label } from "./label";

type InputStoryProps = {
  label: string;
  placeholder: string;
  value: string;
  variant: "default" | "search" | "pill" | "inline";
  size: "sm" | "md" | "lg";
  editable: boolean;
};

function InputStory({ label, placeholder, value, variant, size, editable }: InputStoryProps) {
  return (
    <>
      <Label>{label}</Label>
      <Input
        placeholder={placeholder}
        value={value}
        variant={variant}
        size={size}
        editable={editable}
        onChangeText={() => {}}
      />
    </>
  );
}

const meta = {
  title: "공통 UI/입력",
  component: InputStory,
  args: {
    label: "이메일",
    placeholder: "name@example.com",
    value: "",
    variant: "default",
    size: "md",
    editable: true,
  },
  argTypes: {
    label: { control: "text" },
    placeholder: { control: "text" },
    value: { control: "text" },
    variant: { control: "select", options: ["default", "search", "pill", "inline"] },
    size: { control: "select", options: ["sm", "md", "lg"] },
    editable: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm gap-2 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof InputStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Disabled: Story = {
  name: "비활성",
  args: {
    value: "비활성 입력",
    editable: false,
  },
};

export const Variants: Story = {
  name: "변형",
  render: () => (
    <View className="gap-3">
      <Input placeholder="기본" />
      <Input
        variant="search"
        placeholder="검색"
      />
      <Input
        variant="pill"
        placeholder="필"
      />
      <Input
        variant="inline"
        placeholder="인라인"
      />
    </View>
  ),
};
