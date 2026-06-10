import { View } from "react-native";

import { IconButton } from "@/components/ui/icon-button";
import { getThemeTokens } from "@/lib/theme";
import type { Meta, StoryObj } from "@storybook/react-native";

import { AccountRow } from "./account-row";

import { Trash2 } from "lucide-react-native/icons";

const meta = {
  title: "기능/계정/계정 행",
  component: AccountRow,
  parameters: {
    docs: {
      description: {
        component: "모바일 전용 계정 설정 행이다. md 이상에서는 사용하지 않는다.",
      },
    },
  },
  args: {
    label: "이메일",
    value: "injae@example.com",
    actionLabel: "변경",
    destructive: false,
  },
  argTypes: {
    label: { control: "text" },
    value: { control: "text" },
    actionLabel: { control: "text" },
    destructive: { control: "boolean" },
  },
  decorators: [
    (Story) => (
      <View className="max-w-md gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AccountRow>;

export default meta;

type Story = StoryObj<typeof meta>;

const tokens = getThemeTokens("light");

export const Basic: Story = {
  name: "기본",
};

export const WithIconAction: Story = {
  name: "아이콘 액션",
  args: {
    action: (
      <IconButton
        accessibilityLabel="멤버 제외"
        className="active:bg-destructive/10 web:hover:bg-destructive/10"
        color={tokens.destructive}
        icon={Trash2}
        size="sm"
        variant="ghost"
      />
    ),
    actionLabel: undefined,
    label: "멤버",
    value: "이나제",
  },
};
