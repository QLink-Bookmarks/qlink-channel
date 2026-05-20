import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { DetailPanel } from "./detail-panel";

import { useArgs } from "storybook/preview-api";

type DetailPanelStoryArgs = {
  open: boolean;
  title: string;
  url: string;
  summary?: string;
  tags: string[];
  mode?: "inline" | "overlay";
};

function DetailPanelStory({
  open,
  title,
  url,
  summary,
  tags,
  mode,
  onOpenChange,
}: DetailPanelStoryArgs & { onOpenChange: (open: boolean) => void }) {
  return (
    <DetailPanel
      open={open}
      title={title}
      url={url}
      summary={summary}
      tags={tags}
      mode={mode}
      className="flex"
      onOpenChange={onOpenChange}
    />
  );
}

const meta = {
  title: "기능/링크/상세 패널",
  parameters: {
    docs: {
      description: {
        component: "와이드뷰 전용 링크 상세 패널이다. md 이상에서 사용한다.",
      },
    },
  },
  args: {
    open: true,
    title: "QLINK 컴포넌트 시스템",
    url: "https://qlink.app/reference",
    summary: "저장한 링크의 요약, 태그, 액션을 확인하는 상세 미리보기다.",
    tags: ["레퍼런스", "디자인"],
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <DetailPanelStory
        {...args}
        onOpenChange={(open) => updateArgs({ open })}
      />
    );
  },
  decorators: [
    (Story) => (
      <View className="h-[800px] flex-row justify-end p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<DetailPanelStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  args: {
    mode: "overlay",
  },
};

export const MaxWidthInline: Story = {
  name: "최대 너비 인라인",
  args: {
    mode: "inline",
  },
};

export const Overlay: Story = {
  name: "오버레이",
  args: {
    mode: "overlay",
  },
};
