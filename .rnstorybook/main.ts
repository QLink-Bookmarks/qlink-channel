import type { StorybookConfig } from "@storybook/react-native";

const main: StorybookConfig = {
  stories: [
    "../components/**/*.stories.?(ts|tsx|js|jsx)",
    "../features/**/*.stories.?(ts|tsx|js|jsx)",
  ],
  deviceAddons: [
    "@storybook/addon-ondevice-notes",
    "@storybook/addon-ondevice-controls",
    "@storybook/addon-ondevice-backgrounds",
    "@storybook/addon-ondevice-actions",
  ],
  framework: "@storybook/react-native",
};

export default main;
