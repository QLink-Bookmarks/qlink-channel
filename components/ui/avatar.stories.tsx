import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Text } from "./text";

const meta = {
  title: "UI/Avatar",
  component: Avatar,
  args: {
    alt: "User avatar",
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Avatar>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Avatar
      alt="User avatar"
      className="size-12"
    >
      <AvatarImage source={{ uri: "https://github.com/shadcn.png" }} />
      <AvatarFallback>
        <Text>CN</Text>
      </AvatarFallback>
    </Avatar>
  ),
};

export const Group: Story = {
  render: () => (
    <View className="flex-row -space-x-2">
      {["IN", "QL", "RN"].map((initials) => (
        <Avatar
          key={initials}
          alt={`${initials} avatar`}
          className="size-10 border-2 border-background"
        >
          <AvatarFallback>
            <Text variant="small">{initials}</Text>
          </AvatarFallback>
        </Avatar>
      ))}
    </View>
  ),
};
