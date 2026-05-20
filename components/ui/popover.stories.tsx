import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { Text } from "./text";

const meta = {
  title: "공통 UI/팝오버",
  component: Popover,
  decorators: [
    (Story) => (
      <View className="items-start p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Popover>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">
          <Text>팝오버 열기</Text>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Text variant="large">워크스페이스</Text>
        <Text variant="muted">결제, 멤버, 알림 설정을 관리한다.</Text>
      </PopoverContent>
    </Popover>
  ),
};
