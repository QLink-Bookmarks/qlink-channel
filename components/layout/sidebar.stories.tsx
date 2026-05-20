import { View } from "react-native";

import { Text } from "@/components/ui/text";
import type { Meta, StoryObj } from "@storybook/react-native";

import { Sidebar, SidebarCTA, SidebarItem, SidebarProfile, SidebarSection } from "./sidebar";

import { Folder, House, Link } from "lucide-react-native/icons";
import { useArgs } from "storybook/preview-api";

type SidebarStoryArgs = {
  activeItem: "home" | "links" | "design";
};

function SidebarContent({
  activeItem,
  onActiveItemChange,
}: SidebarStoryArgs & {
  onActiveItemChange: (activeItem: SidebarStoryArgs["activeItem"]) => void;
}) {
  return (
    <Sidebar className="flex">
      <SidebarCTA label="링크 추가" />
      <View className="mt-4 gap-1">
        <SidebarItem
          icon={House}
          label="홈"
          active={activeItem === "home"}
          onPress={() => onActiveItemChange("home")}
        />
        <SidebarItem
          icon={Link}
          label="링크"
          count={12}
          active={activeItem === "links"}
          onPress={() => onActiveItemChange("links")}
        />
      </View>
      <SidebarSection
        title="폴더"
        actionLabel="새로 만들기"
      >
        <SidebarItem
          icon={Folder}
          label="디자인"
          active={activeItem === "design"}
          onPress={() => onActiveItemChange("design")}
        />
        <View className="rounded-xl border border-sidebar-border bg-sidebar-accent p-3">
          <Text className="text-xs font-semibold text-sidebar-accent-foreground">
            토큰 accent 확인
          </Text>
          <Text className="text-xs text-sidebar-foreground">
            Storybook toolbar의 강조 색상을 바꾸면 sidebar token이 함께 바뀐다.
          </Text>
        </View>
      </SidebarSection>
      <View className="mt-auto">
        <SidebarProfile
          name="Injae Song"
          email="injae@example.com"
        />
      </View>
    </Sidebar>
  );
}

const meta = {
  title: "레이아웃/사이드바",
  parameters: {
    docs: {
      description: {
        component: "와이드뷰 전용 사이드 내비게이션이다. md 이상에서 사용한다.",
      },
    },
  },
  args: {
    activeItem: "home",
  },
  argTypes: {
    activeItem: { control: "select", options: ["home", "links", "design"] },
  },
  render: function Render(args) {
    const [, updateArgs] = useArgs();

    return (
      <SidebarContent
        activeItem={args.activeItem}
        onActiveItemChange={(activeItem) => updateArgs({ activeItem })}
      />
    );
  },
  decorators: [
    (Story) => (
      <View className="p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<SidebarStoryArgs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
