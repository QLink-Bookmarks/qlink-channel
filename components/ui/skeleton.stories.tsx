import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Skeleton } from "./skeleton";

const meta = {
  title: "UI/Skeleton",
  component: Skeleton,
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Skeleton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <View className="gap-3">
      <View className="flex-row items-center gap-3">
        <Skeleton className="size-12 rounded-full" />
        <View className="flex-1 gap-2">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </View>
      </View>
      <Skeleton className="h-24 w-full" />
    </View>
  ),
};
