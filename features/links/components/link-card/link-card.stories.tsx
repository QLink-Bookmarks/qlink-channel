import { Pressable, View } from "react-native";

import { Icon } from "@/components/ui/icon";
import type { Meta, StoryObj } from "@storybook/react-native";

import { LinkCard, type LinkCardTodo } from "./link-card";

import { ExternalLink, Folder, Star, Trash2 } from "lucide-react-native/icons";
import { useArgs } from "storybook/preview-api";

function HoverIconButton({ icon }: { icon: typeof ExternalLink }) {
  return (
    <Pressable className="size-10 items-center justify-center rounded-2xl border border-border-soft bg-card shadow-qlink-sm">
      <Icon
        as={icon}
        className="size-4 text-muted-foreground"
      />
    </Pressable>
  );
}

const meta = {
  title: "기능/링크/링크 카드",
  component: LinkCard,
  args: {
    domain: "saramin.co.kr",
    title: "데이터 마케팅 인턴 - 5/14 마감",
    summary: "주 4일, 강남, 마케팅 데이터 분석 인턴. 마감일: 2026-05-14",
    tags: ["#채용", "#인턴", "#마케팅", "리서치"],
    todos: [
      { id: "1", text: "자기소개서 초안 작성", dueLabel: "5/19 17:40", overdue: true },
      { id: "2", text: "포트폴리오 PDF 첨부", dueLabel: "5/22 10:40" },
      { id: "3", text: "제출 전 오탈자 확인" },
    ],
  },
  decorators: [
    (Story) => (
      <View className="max-w-md p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof LinkCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <LinkCard
        {...args}
        onTodoToggle={(id, done) => {
          const todos: LinkCardTodo[] = (args.todos ?? []).map((todo) =>
            todo.id === id ? { ...todo, done } : todo,
          );

          updateArgs({ todos });
        }}
      />
    );
  },
};

export const States: Story = {
  name: "상태",
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    const handleTodoToggle = (id: string, done: boolean) => {
      const todos: LinkCardTodo[] = (args.todos ?? []).map((todo) =>
        todo.id === id ? { ...todo, done } : todo,
      );

      updateArgs({ todos });
    };

    return (
      <View className="gap-3">
        <LinkCard
          {...args}
          onTodoToggle={handleTodoToggle}
        />
        <LinkCard
          {...args}
          active
          pinned
          remainingTodoCount={1}
          onTodoToggle={handleTodoToggle}
          leadingHoverActions={
            <Icon
              as={Star}
              className="size-4 text-muted-foreground"
            />
          }
          trailingHoverActions={
            <>
              <HoverIconButton icon={ExternalLink} />
              <HoverIconButton icon={Folder} />
              <HoverIconButton icon={Trash2} />
            </>
          }
        />
      </View>
    );
  },
};
