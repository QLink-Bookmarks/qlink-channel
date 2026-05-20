import type { StorybookConfig } from "@storybook/react-native-web-vite";

const main: StorybookConfig = {
  stories: [
    "../components/**/*.stories.mdx",
    "../components/**/*.stories.@(js|jsx|ts|tsx)",
    "../features/**/*.stories.@(js|jsx|ts|tsx)",
  ],

  addons: ["@storybook/addon-docs", "@chromatic-com/storybook"],

  framework: {
    name: "@storybook/react-native-web-vite",
    options: {
      modulesToTranspile: [
        "nativewind",
        "react-native-css-interop",
        "react-native-reanimated",
        "react-native-worklets",
      ],

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
      "process.env.STORYBOOK_VITE": true,
    },
    optimizeDeps: {
      ...config.optimizeDeps,
      include: [...(config.optimizeDeps?.include ?? []), "nativewind", "react-native-css-interop"],
    },
    build: {
      ...config.build,
      commonjsOptions: {
        ...config.build?.commonjsOptions,
        transformMixedEsModules: true,
      },
    },
  }),
};

export default main;
