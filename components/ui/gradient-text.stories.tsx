import { View } from "react-native";

import { type AccentName, type ThemeMode } from "@/lib/theme";
import type { Meta, StoryObj } from "@storybook/react-native";

import { GradientText } from "./gradient-text";

const meta = {
  title: "공통 UI/그라디언트 텍스트",
  component: GradientText,
  args: {
    children: "QLINK",
    variant: "title",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "h1", "h2", "h3", "h4", "lead", "title", "large", "muted"],
    },
    accent: { table: { disable: true } },
    mode: { table: { disable: true } },
  },
  render: (args, context) => (
    <GradientText
      {...args}
      accent={(context.globals.accent ?? "gray") as AccentName}
      mode={(context.globals.mode ?? "light") as ThemeMode}
    />
  ),
  decorators: [
    (Story) => (
      <View className="max-w-xl gap-4 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof GradientText>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Variants: Story = {
  name: "변형",
  render: (_args, context) => (
    <View className="gap-3">
      <GradientText
        variant="h1"
        accent={(context.globals.accent ?? "gray") as AccentName}
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        QLINK
      </GradientText>
      <GradientText
        variant="title"
        accent={(context.globals.accent ?? "gray") as AccentName}
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        Workspace
      </GradientText>
      <GradientText
        variant="lead"
        accent={(context.globals.accent ?? "gray") as AccentName}
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        gradient text preview
      </GradientText>
      <GradientText
        variant="large"
        accent={(context.globals.accent ?? "gray") as AccentName}
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        Accent Current
      </GradientText>
      <GradientText
        variant="large"
        accent="pink"
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        Accent Pink
      </GradientText>
      <GradientText
        variant="large"
        accent="blue"
        mode={(context.globals.mode ?? "light") as ThemeMode}
      >
        Accent Blue
      </GradientText>
    </View>
  ),
};
