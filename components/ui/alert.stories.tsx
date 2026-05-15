import { View } from "react-native";

import type { Meta, StoryObj } from "@storybook/react-native";

import { Alert, AlertDescription, AlertTitle } from "./alert";

import { CircleAlert, Terminal } from "lucide-react-native/icons";

const meta = {
  title: "UI/Alert",
  component: Alert,
  args: {
    icon: Terminal,
  },
  decorators: [
    (Story) => (
      <View className="w-full max-w-xl p-4">
        <Story />
      </View>
    ),
  ],
} satisfies Meta<typeof Alert>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Basic: Story = {
  render: () => (
    <Alert icon={Terminal}>
      <AlertTitle>Heads up</AlertTitle>
      <AlertDescription>
        You can add components to your app using the reusables CLI.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  args: {
    icon: CircleAlert,
  },
  render: () => (
    <Alert
      icon={CircleAlert}
      variant="destructive"
    >
      <AlertTitle>Unable to save</AlertTitle>
      <AlertDescription>Check the required fields and try again.</AlertDescription>
    </Alert>
  ),
};
