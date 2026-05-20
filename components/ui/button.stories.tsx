import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Text } from "./text";

type ButtonStoryProps = {
  label: string;
  variant:
    | "default"
    | "primary"
    | "destructive"
    | "danger"
    | "outline"
    | "secondary"
    | "ghost"
    | "kakao"
    | "social"
    | "gradient"
    | "link";
  size: "xs" | "default" | "sm" | "lg" | "icon";
  disabled: boolean;
};

function ButtonStory({ label, variant, size, disabled }: ButtonStoryProps) {
  return (
    <Button
      variant={variant}
      size={size}
      disabled={disabled}
      onPress={() => {}}
    >
      <Text>{label}</Text>
    </Button>
  );
}

const meta = {
  title: "공통 UI/버튼",
  component: ButtonStory,
  args: {
    label: "버튼",
    variant: "default",
    size: "default",
    disabled: false,
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: [
        "default",
        "primary",
        "destructive",
        "danger",
        "outline",
        "secondary",
        "ghost",
        "kakao",
        "social",
        "gradient",
        "link",
      ],
    },
    size: { control: "select", options: ["xs", "default", "sm", "lg", "icon"] },
    disabled: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Variants: Story = {
  name: "변형",
  render: ({ size, disabled }) => (
    <View className="items-start gap-3">
      <Button
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>기본</Text>
      </Button>
      <Button
        variant="primary"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>주요</Text>
      </Button>
      <Button
        variant="secondary"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>보조</Text>
      </Button>
      <Button
        variant="outline"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>외곽선</Text>
      </Button>
      <Button
        variant="destructive"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>위험</Text>
      </Button>
      <Button
        variant="ghost"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>고스트</Text>
      </Button>
      <Button
        variant="kakao"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>Kakao</Text>
      </Button>
      <Button
        variant="social"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>소셜</Text>
      </Button>
      <Button
        variant="gradient"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>그라디언트</Text>
      </Button>
      <Button
        variant="link"
        size={size}
        disabled={disabled}
        onPress={() => {}}
      >
        <Text>링크</Text>
      </Button>
    </View>
  ),
};
