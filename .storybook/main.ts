import type { StorybookConfig } from "@storybook/react-native-web-vite";

const main: StorybookConfig = {
  stories: ["../components/**/*.stories.mdx", "../components/**/*.stories.@(js|jsx|ts|tsx)"],

  addons: ["@storybook/addon-docs", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      modulesToTranspile: ["react-native-reanimated", "react-native-worklets"],

      pluginReactOptions: {
        jsxImportSource: "nativewind",
        babel: {
          plugins: ["@babel/plugin-proposal-export-namespace-from", "react-native-worklets/plugin"],
        },
      },
    },
  },

  viteFinal: async (config) => ({
    ...config,
    define: {
      ...config.define,
      "process.env.STORYBOOK_VITE": JSON.stringify(process.env.STORYBOOK_VITE),
    },
  }),
};

export default main;
