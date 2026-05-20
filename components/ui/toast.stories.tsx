import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Toast } from "./toast";

type ToastStoryProps = {
  variant: "default" | "success" | "error" | "gradient";
  title: string;
  description?: string;
  dismissible: boolean;
};

function ToastStory({ variant, title, description, dismissible }: ToastStoryProps) {
  return (
    <Toast
      variant={variant}
      title={title}
      description={description}
      onDismiss={dismissible ? () => {} : undefined}
    />
  );
}

const meta = {
  title: "공통 UI/토스트",
  component: ToastStory,
  args: {
    variant: "default",
    title: "저장됨",
    description: "링크가 저장되었다.",
    dismissible: true,
  },
  argTypes: {
    variant: { control: "select", options: ["default", "success", "error", "gradient"] },
    title: { control: "text" },
    description: { control: "text" },
    dismissible: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ToastStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Variants: Story = {
  name: "변형",
  render: (args) => <ToastStory {...args} />,
};
