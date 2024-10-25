module.exports = {
  extends: "../.eslintrc",

  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: true,
    sourceType: "module",
  },

  env: {
    node: true,
  },

  overrides: [
    {
      files: ["**/*.ts"],
      rules: {
        "@typescript-eslint/no-extraneous-class": "off",
        "@typescript-eslint/prefer-optional-chain": "off",
        "@typescript-eslint/restrict-template-expressions": "off",
      },
    },
  ],
};
