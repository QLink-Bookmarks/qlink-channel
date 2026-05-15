import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Text } from "./text";

const meta = {
  title: "UI/Text",
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
  render: () => <Text>Reusable text component</Text>,
};

export const Variants: Story = {
  render: () => (
    <>
      <Text variant="h1">Heading 1</Text>
      <Text variant="h2">Heading 2</Text>
      <Text variant="h3">Heading 3</Text>
      <Text variant="lead">Lead text for important supporting copy.</Text>
      <Text variant="p">Paragraph text with comfortable line height.</Text>
      <Text variant="blockquote">A concise quote style for callouts.</Text>
      <Text variant="code">npm run storybook</Text>
      <Text variant="muted">Muted helper text</Text>
    </>
  ),
};
