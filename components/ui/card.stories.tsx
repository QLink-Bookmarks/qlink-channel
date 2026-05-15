import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Text } from "./text";

const meta = {
  title: "UI/Card",
  component: Card,
  decorators: [
    (Story) => (
      <View className="w-full max-w-sm p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Card>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>Shared workspace for growing teams.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text variant="h3">$29/mo</Text>
        <Text variant="muted">Includes unlimited projects and 10 seats.</Text>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Text>Upgrade</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
};
