import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Text } from "./text";

type TabsStoryProps = {
  value: "overview" | "activity";
};

function TabsDemo({ value: initialValue = "overview" }: TabsStoryProps) {
  const [value, setValue] = React.useState(initialValue);

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue as TabsStoryProps["value"]);
  };

  return (
    <Tabs
      value={value}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">
          <Text>개요</Text>
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Text>활동</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="rounded-md border border-border p-4"
      >
        <Text variant="large">개요</Text>
        <Text variant="muted">현재 워크스페이스의 간단한 요약이다.</Text>
      </TabsContent>
      <TabsContent
        value="activity"
        className="rounded-md border border-border p-4"
      >
        <Text variant="large">활동</Text>
        <Text variant="muted">최근 변경 사항과 이벤트가 여기에 표시된다.</Text>
      </TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "공통 UI/탭",
  component: TabsDemo,
  args: {
    value: "overview",
  },
  argTypes: {
    value: { control: "select", options: ["overview", "activity"] },
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-md p-4">
        <Story />
      </View>
    ),
  ],
  render: (args) => <TabsDemo {...args} />,
} satisfies Meta<typeof TabsDemo>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
};
