import * as React from "react";
import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./tabs";
import { Text } from "./text";

import { fn } from "storybook/test";

function TabsDemo({
  value: initialValue = "overview",
  onValueChange = fn(),
}: React.ComponentProps<typeof Tabs>) {
  const [value, setValue] = React.useState(initialValue);

  const handleValueChange = (nextValue: string) => {
    setValue(nextValue);
    onValueChange(nextValue);
  };

  return (
    <Tabs
      value={value}
      onValueChange={handleValueChange}
      className="w-full"
    >
      <TabsList>
        <TabsTrigger value="overview">
          <Text>Overview</Text>
        </TabsTrigger>
        <TabsTrigger value="activity">
          <Text>Activity</Text>
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="overview"
        className="rounded-md border border-border p-4"
      >
        <Text variant="large">Overview</Text>
        <Text variant="muted">A compact summary of the current workspace.</Text>
      </TabsContent>
      <TabsContent
        value="activity"
        className="rounded-md border border-border p-4"
      >
        <Text variant="large">Activity</Text>
        <Text variant="muted">Recent changes and events appear here.</Text>
      </TabsContent>
    </Tabs>
  );
}

const meta = {
  title: "UI/Tabs",
  component: Tabs,
  args: {
    value: "overview",
    onValueChange: fn(),
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-md p-4">
        <Story />
      </View>
    ),
  ],
  render: (args) => <TabsDemo {...args} />,
} satisfies Meta<typeof Tabs>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {};
