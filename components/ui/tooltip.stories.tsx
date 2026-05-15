import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Text } from "./text";
import { Tooltip, TooltipContent, TooltipTrigger } from "./tooltip";

const meta = {
  title: "UI/Tooltip",
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
  render: () => (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>
        <Button variant="outline">
          <Text>Hover or press</Text>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        <Text>Tooltip content</Text>
      </TooltipContent>
    </Tooltip>
  ),
};
