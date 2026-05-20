import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Alert, AlertDescription, AlertTitle } from "./alert";

import {
  CircleAlert,
  CircleCheck,
  Info,
  Lightbulb,
  Terminal,
  TriangleAlert,
} from "lucide-react-native/icons";

type AlertStoryProps = {
  variant: "default" | "info" | "warning" | "success" | "danger" | "hint" | "destructive";
  iconName: "terminal" | "info" | "warning" | "success" | "danger" | "hint";
  title: string;
  description: string;
};

const iconMap = {
  terminal: Terminal,
  info: Info,
  warning: TriangleAlert,
  success: CircleCheck,
  danger: CircleAlert,
  hint: Lightbulb,
} satisfies Record<AlertStoryProps["iconName"], typeof Terminal>;

function AlertStory({ variant, iconName, title, description }: AlertStoryProps) {
  return (
    <Alert
      icon={iconMap[iconName]}
      variant={variant}
    >
      <AlertTitle>{title}</AlertTitle>
      <AlertDescription>{description}</AlertDescription>
    </Alert>
  );
}

const meta = {
  title: "공통 UI/알림",
  component: AlertStory,
  args: {
    variant: "default",
    iconName: "terminal",
    title: "확인 필요",
    description: "재사용 가능한 컴포넌트를 앱 화면에 조합해 사용할 수 있다.",
  },
  argTypes: {
    variant: {
      control: "select",
      options: ["default", "info", "warning", "success", "danger", "hint", "destructive"],
    },
    iconName: {
      control: "select",
      options: ["terminal", "info", "warning", "success", "danger", "hint"],
    },
    title: { control: "text" },
    description: { control: "text" },
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-xl p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof AlertStory>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};

export const Destructive: Story = {
  name: "위험",
  args: {
    variant: "destructive",
    iconName: "danger",
    title: "저장할 수 없음",
    description: "필수 항목을 확인한 뒤 다시 시도한다.",
  },
};
