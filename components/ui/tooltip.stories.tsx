import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Text } from "./text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "공통 UI/툴팁",
  component: Tooltip,
  decorators: [
    (Story) => (
      <View className="items-start p-8">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Tooltip>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: () => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Text>호버 또는 누르기</Text>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Text>툴팁 내용</Text>
      </TooltipContent>
    </Tooltip>
  ),
};
