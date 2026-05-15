module.exports = {
  printWidth: 100,
  singleAttributePerLine: true,
  plugins: ["@trivago/prettier-plugin-sort-imports", "prettier-plugin-tailwindcss"],
  importOrder: [
    ".css$",
    ".styles",
    "style",
    "^react",
    "^@",
    "^[../]",
    "^[./]",
    "<THIRD_PARTY_MODULES>",
  ],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
};
