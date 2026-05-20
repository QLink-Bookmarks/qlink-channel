import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { EmptyState } from "./empty-state";
import { Text } from "./text";

type EmptyStateStoryProps = {
  emoji?: string;
  title: string;
  description?: string;
  showAction: boolean;
  actionLabel: string;
};

function EmptyStateStory({
  emoji,
  title,
  description,
  showAction,
  actionLabel,
}: EmptyStateStoryProps) {
  return (
    <EmptyState
      emoji={emoji}
      title={title}
      description={description}
      actions={
        showAction ? (
          <Button size="sm">
            <Text>{actionLabel}</Text>
          </Button>
        ) : undefined
      }
    />
  );
}

const meta = {
  title: "공통 UI/빈 상태",
  component: EmptyStateStory,
  args: {
    emoji: "Q",
    title: "아직 링크가 없음",
    description: "저장한 링크가 여기에 표시된다.",
    showAction: true,
    actionLabel: "링크 추가",
  },
  argTypes: {
    emoji: { control: "text" },
    title: { control: "text" },
    description: { control: "text" },
    showAction: { control: "boolean" },
    actionLabel: { control: "text" },
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof EmptyStateStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: (args) => <EmptyStateStory {...args} />,
};
