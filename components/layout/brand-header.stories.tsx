import { View } from "react-native";

import { type AccentName, type ThemeMode } from "@/lib/theme";
import type { Meta, StoryObj } from "@storybook/react-native";

import { BrandHeader } from "./brand-header";

const meta = {
  title: "레이아웃/브랜드 헤더",
  component: BrandHeader,
  parameters: {
    docs: {
      description: {
        component: "레이아웃 상단에 재사용할 수 있는 브랜드 헤더다.",
      },
    },
  },
  args: {
    title: "QLINK",
  },
  argTypes: {
    title: { control: "text" },
    accent: { table: { disable: true } },
    mode: { table: { disable: true } },
  },
  render: (args, context) => (
    <BrandHeader
      {...args}
      accent={(context.globals.accent ?? "gray") as AccentName}
      mode={(context.globals.mode ?? "light") as ThemeMode}
    />
  ),
  decorators: [
    (Story) => (
      <View className="max-w-sm rounded-[28px] border border-sidebar-border bg-sidebar p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof BrandHeader>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
