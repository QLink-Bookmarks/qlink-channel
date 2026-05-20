import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Text } from "./text";

const meta = {
  title: "공통 UI/텍스트",
  component: Text,
  decorators: [
    (Story) => (
      <View className="w-full max-w-xl gap-3 p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Text>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  name: "기본",
  render: () => <Text>재사용 가능한 텍스트 컴포넌트</Text>,
};

export const Variants: Story = {
  name: "변형",
  render: () => (
    <>
      <Text variant="h1">제목 1</Text>
      <Text variant="h2">제목 2</Text>
      <Text variant="h3">제목 3</Text>
      <Text variant="lead">중요한 보조 설명에 사용하는 리드 텍스트.</Text>
      <Text variant="p">읽기 편한 줄 높이를 가진 문단 텍스트.</Text>
      <Text variant="blockquote">강조 영역에 사용하는 간결한 인용 스타일.</Text>
      <Text variant="code">npm run storybook</Text>
      <Text variant="muted">보조 설명 텍스트</Text>
    </>
  ),
};
