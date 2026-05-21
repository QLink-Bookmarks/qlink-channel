import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { IconButton } from "./icon-button";

import { ChevronLeft, Plus, Search, Settings, X } from "lucide-react-native/icons";

const iconOptions = {
  search: Search,
  plus: Plus,
  settings: Settings,
  close: X,
  back: ChevronLeft,
} as const;

type IconButtonStoryProps = {
  iconName: keyof typeof iconOptions;
  size: "sm" | "md" | "lg";
  disabled: boolean;
};

function IconButtonStory({ iconName, size, disabled }: IconButtonStoryProps) {
  return (
    <IconButton
      icon={iconOptions[iconName]}
      size={size}
      disabled={disabled}
      onPress={() => {}}
    />
  );
}

const meta = {
  title: "공통 UI/아이콘 버튼",
  component: IconButtonStory,
  args: {
    iconName: "search",
    size: "md",
    disabled: false,
  },
  argTypes: {
    iconName: {
      control: "select",
      options: Object.keys(iconOptions),
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
    disabled: {
      control: "boolean",
    },
  },
  decorators: [
    (Story) => (
      <View className="p-6">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof IconButtonStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Sizes: Story = {
  name: "크기",
  render: ({ disabled }) => (
    <View className="flex-row items-center gap-3">
      <IconButton
        icon={Search}
        size="sm"
        disabled={disabled}
        onPress={() => {}}
      />
      <IconButton
        icon={Search}
        size="md"
        disabled={disabled}
        onPress={() => {}}
      />
      <IconButton
        icon={Search}
        size="lg"
        disabled={disabled}
        onPress={() => {}}
      />
    </View>
  ),
};

export const StatePreview: Story = {
  name: "상태 프리뷰",
  render: () => (
    <View className="flex-row items-center gap-4">
      <IconButton
        icon={Search}
        onPress={() => {}}
      />
      <View className="rounded-full bg-accent">
        <IconButton
          icon={Search}
          className="bg-accent"
          onPress={() => {}}
        />
      </View>
    </View>
  ),
};
