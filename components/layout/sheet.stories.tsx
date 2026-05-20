import { View } from "react-native";

import { Text } from "@/components/ui/text";
import { type AccentName, type ThemeMode } from "@/lib/theme";
import type { Meta, StoryObj } from "@storybook/react-native";

import { Sheet } from "./sheet";

type SheetStoryProps = {
  open: boolean;
  title: string;
  dismissible: boolean;
  snapHeight: "45%" | "60%" | "80%";
  initialSnapIndex: number;
  accent: AccentName;
  mode: ThemeMode;
};

const meta = {
  title: "레이아웃/시트",
  component: SheetStory,
  parameters: {
    docs: {
      description: {
        component: "모바일 전용 바텀시트다. md 이상에서는 사용하지 않는다.",
      },
    },
  },
  args: {
    open: true,
    title: "시트 제목",
    dismissible: true,
    snapHeight: "45%",
    initialSnapIndex: 0,
    accent: "gray",
    mode: "light",
  },
  argTypes: {
    open: { control: "boolean" },
    dismissible: { control: "boolean" },
    title: { control: "text" },
    snapHeight: { control: "select", options: ["45%", "60%", "80%"] },
    initialSnapIndex: { control: { type: "number", min: 0, max: 0, step: 1 } },
    accent: { table: { disable: true } },
    mode: { table: { disable: true } },
  },
  render: (args, context) => (
    <SheetStory
      {...args}
      accent={(context.globals.accent ?? "gray") as AccentName}
      mode={(context.globals.mode ?? "light") as ThemeMode}
    />
  ),
  decorators: [
    (Story) => (
      <View className="h-[800px] p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof SheetStory>;

export default meta;

type Story = StoryObj<typeof meta>;

function SheetContent() {
  return (
    <>
      <Text className="text-muted-foreground">
        모바일 전용 바텀시트 콘텐츠 예시다. 긴 콘텐츠에서도 패널 안쪽 스크롤을 확인한다.
      </Text>
      {Array.from({ length: 8 }).map((_, index) => (
        <View
          key={index}
          className="rounded-xl border border-border-soft bg-surface-elevated p-3"
        >
          <Text className="font-medium">스크롤 콘텐츠 {index + 1}</Text>
          <Text className="text-sm text-muted-foreground">
            긴 콘텐츠에서도 패널 안쪽에서 스크롤되는지 확인하기 위한 항목이다.
          </Text>
        </View>
      ))}
    </>
  );
}

function SheetStory({
  open,
  title,
  dismissible,
  snapHeight,
  initialSnapIndex,
  accent,
  mode,
}: SheetStoryProps) {
  return (
    <Sheet
      open={open}
      title={title}
      dismissible={dismissible}
      snapPoints={[snapHeight]}
      initialSnapIndex={initialSnapIndex}
      accent={accent}
      mode={mode}
      onOpenChange={() => {}}
    >
      <SheetContent />
    </Sheet>
  );
}

export const Basic: Story = {
  name: "기본",
};

export const LongContent: Story = {
  name: "긴 콘텐츠",
  args: {
    snapHeight: "80%",
  },
};

export const NotDismissible: Story = {
  name: "닫기 비활성",
  args: {
    dismissible: false,
  },
  render: ({ open, title, dismissible, snapHeight, initialSnapIndex }, context) => (
    <Sheet
      open={open}
      title={title}
      dismissible={dismissible}
      snapPoints={[snapHeight]}
      initialSnapIndex={initialSnapIndex}
      accent={(context.globals.accent ?? "gray") as AccentName}
      mode={(context.globals.mode ?? "light") as ThemeMode}
      onOpenChange={() => {}}
    >
      <Text className="text-muted-foreground">이 상태에서는 배경을 눌러도 닫히지 않는다.</Text>
    </Sheet>
  ),
};
