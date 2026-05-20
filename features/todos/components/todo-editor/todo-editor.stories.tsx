import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { TodoEditor } from "./todo-editor";

import { useArgs } from "storybook/preview-api";

type TodoEditorStoryArgs = {
  value: string;
  mode: "none" | "time" | "recurring";
  visibility: "public" | "private";
};

function TodoEditorStory({
  value,
  mode,
  visibility,
  onChangeText,
  onModeChange,
  onVisibilityChange,
}: TodoEditorStoryArgs & {
  onChangeText: (value: string) => void;
  onModeChange: (mode: TodoEditorStoryArgs["mode"]) => void;
  onVisibilityChange: (visibility: TodoEditorStoryArgs["visibility"]) => void;
}) {
  return (
    <TodoEditor
      value={value}
      mode={mode}
      visibility={visibility}
      onChangeText={onChangeText}
      onModeChange={onModeChange}
      onVisibilityChange={onVisibilityChange}
    />
  );
}

const meta = {
  title: "기능/할 일/할 일 편집기",
  args: {
    value: "컴포넌트 스토리 작성",
    mode: "time",
    visibility: "private",
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <TodoEditorStory
        {...args}
        onChangeText={(value) => updateArgs({ value })}
        onModeChange={(mode) => updateArgs({ mode })}
        onVisibilityChange={(visibility) => updateArgs({ visibility })}
      />
    );
  },
  decorators: [
    (Story) => (
      <View className="max-w-md p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<TodoEditorStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
