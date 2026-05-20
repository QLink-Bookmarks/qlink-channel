import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { ShortcutTile } from "./shortcut-tile";

const meta = {
  title: "기능/링크/바로가기 타일",
  component: ShortcutTile,
  parameters: {
    docs: {
      description: {
        component: "와이드뷰 전용 바로가기 타일이다. md 이상에서 사용한다.",
      },
    },
  },
  args: {
    label: "QLINK",
  },
  decorators: [
    (Story) => (
      <View className="flex-row gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof ShortcutTile>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  args: {
    label: "QLINK",
  },
  render: () => (
    <>
      <ShortcutTile label="QLINK" />
      <ShortcutTile
        label="삭제"
        removable
      />
      <ShortcutTile
        label="추가"
        add
      />
    </>
  ),
};
