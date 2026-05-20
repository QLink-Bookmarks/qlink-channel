import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Button } from "./button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "./card";
import { Text } from "./text";

const meta = {
  title: "공통 UI/카드",
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
  name: "기본",
  render: () => (
    <Card>
      <CardHeader>
        <CardTitle>팀 플랜</CardTitle>
        <CardDescription>성장하는 팀을 위한 공유 작업 공간.</CardDescription>
      </CardHeader>
      <CardContent>
        <Text variant="h3">월 29달러</Text>
        <Text variant="muted">무제한 프로젝트와 좌석 10개가 포함된다.</Text>
      </CardContent>
      <CardFooter>
        <Button className="w-full">
          <Text>업그레이드</Text>
        </Button>
      </CardFooter>
    </Card>
  ),
};

export const Variants: Story = {
  name: "변형",
  render: () => (
    <View className="gap-3">
      {(["flat", "elevated", "interactive", "outlined"] as const).map((variant) => (
        <Card
          key={variant}
          variant={variant}
          density="compact"
        >
          <CardHeader>
            <CardTitle>{variant}</CardTitle>
            <CardDescription>QLINK 카드 변형</CardDescription>
          </CardHeader>
        </Card>
      ))}
    </View>
  ),
};
