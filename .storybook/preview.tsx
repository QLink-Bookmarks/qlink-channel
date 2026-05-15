import "../global.css";

import { View } from "react-native";

import { PortalHost } from "@rn-primitives/portal";
import type { Preview } from "@storybook/react-native";

const preview: Preview = {
  parameters: {
    // actions: { argTypesRegex: "^on[A-Z].*" },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },

  tags: ["autodocs"],

  decorators: [
    (Story) => (
      <View className="flex-1 bg-background">
        <Story />
        <PortalHost />
      </View>
    ),
  ],
};

export default preview;
