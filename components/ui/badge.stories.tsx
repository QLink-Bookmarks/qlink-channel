import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Badge } from "./badge";
import { Text } from "./text";

type BadgeStoryProps = {
  label: string;
  variant:
    | "default"
    | "tag"
    | "status"
    | "todo"
    | "public"
    | "private"
    | "folder"
    | "overdue"
    | "success"
    | "warning"
    | "secondary"
    | "destructive"
    | "outline";
  dot: boolean;
};

function BadgeStory({ label, variant, dot }: BadgeStoryProps) {
  return (
    <Badge
      variant={variant}
      dot={dot}
    >
      <Text>{label}</Text>
    </Badge>
  );
}

const meta = {
  title: "공통 UI/배지",
  component: BadgeStory,
  args: {
    label: "기본",
    variant: "default",
    dot: false,
  },
  argTypes: {
    label: { control: "text" },
    variant: {
      control: "select",
      options: [
        "default",
        "tag",
        "status",
        "todo",
        "public",
        "private",
        "folder",
        "overdue",
        "success",
        "warning",
        "secondary",
        "destructive",
        "outline",
      ],
    },
    dot: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="items-start p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BadgeStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Variants: Story = {
  name: "변형",
  render: () => (
    <View className="flex-row flex-wrap gap-2">
      <Badge>
        <Text>기본</Text>
      </Badge>
      <Badge variant="secondary">
        <Text>보조</Text>
      </Badge>
      <Badge variant="outline">
        <Text>외곽선</Text>
      </Badge>
      <Badge variant="destructive">
        <Text>위험</Text>
      </Badge>
      <Badge
        variant="success"
        dot
      >
        <Text>완료</Text>
      </Badge>
      <Badge
        variant="warning"
        dot
      >
        <Text>주의</Text>
      </Badge>
    </View>
  ),
};
