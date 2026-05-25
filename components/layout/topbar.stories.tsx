import { View } from "react-native";

import { Icon } from "@/components/ui/icon";
import { Kbd } from "@/components/ui/kbd";
import type { Meta, StoryObj } from "@storybook/react-native";

import { Topbar } from "./topbar";

import { Search } from "lucide-react-native/icons";

const meta = {
  title: "레이아웃/상단 바",
  component: Topbar,
  parameters: {
    docs: {
      description: {
        component: "와이드뷰 전용 검색/액션 바다. md 이상에서 사용한다.",
      },
    },
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Topbar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  args: {
    variant: "search",
    searchValue: "",
    placeholder: "링크 검색",
  },
  render: (args) => (
    <Topbar
      {...args}
      className="flex"
      searchLeftSlot={
        <Icon
          as={Search}
          className="size-4 text-muted-foreground"
        />
      }
      searchRightSlot={<Kbd size="sm">⌘K</Kbd>}
      searchAction={{ label: "적용" }}
    />
  ),
};
