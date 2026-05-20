import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { TodoItem } from "./todo-item";

import { useArgs } from "storybook/preview-api";

const meta = {
  title: "기능/할 일/할 일 항목",
  component: TodoItem,
  args: {
    text: "QLINK 테마 토큰 검토",
    badge: "오늘",
    visibility: "public",
    done: false,
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <TodoItem
        {...args}
        onToggle={(done) => updateArgs({ done })}
      />
    );
  },
  decorators: [
    (Story) => (
      <View className="max-w-md gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const States: Story = {
  name: "상태",
  render: (args) => (
    <>
      <TodoItem {...args} />
      <TodoItem
        {...args}
        done
        text="완료된 할 일"
      />
      <TodoItem
        {...args}
        overdue
        badge="기한 초과"
        text="기한이 지난 할 일"
      />
    </>
  ),
};
