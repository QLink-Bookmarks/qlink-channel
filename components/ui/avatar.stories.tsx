import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Avatar, AvatarFallback, AvatarImage } from "./avatar";
import { Text } from "./text";

type AvatarStoryProps = {
  alt: string;
  fallback: string;
  imageUrl: string;
  size: "xs" | "sm" | "md" | "lg" | "xl";
  withImage: boolean;
};

function AvatarStory({ alt, fallback, imageUrl, size, withImage }: AvatarStoryProps) {
  return (
    <Avatar
      alt={alt}
      size={size}
    >
      {withImage && imageUrl ? <AvatarImage source={{ uri: imageUrl }} /> : null}
      <AvatarFallback>
        <Text>{fallback}</Text>
      </AvatarFallback>
    </Avatar>
  );
}

const meta = {
  title: "공통 UI/아바타",
  component: AvatarStory,
  args: {
    alt: "사용자 아바타",
    fallback: "CN",
    imageUrl: "https://github.com/shadcn.png",
    size: "md",
    withImage: true,
  },
  argTypes: {
    alt: { control: "text" },
    fallback: { control: "text" },
    imageUrl: { control: "text" },
    size: { control: "select", options: ["xs", "sm", "md", "lg", "xl"] },
    withImage: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AvatarStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Group: Story = {
  name: "그룹",
  render: () => (
    <View className="flex-row -space-x-2">
      {["IN", "QL", "RN"].map((initials) => (
        <Avatar
          key={initials}
          alt={`${initials} 아바타`}
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
