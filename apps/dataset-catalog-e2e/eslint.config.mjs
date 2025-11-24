import baseConfig from "../../eslint.config.mjs";

export default [
  ...baseConfig,
  {
    files: ["src/**/*.ts"],
    rules: {
      // Add or override rules specific to e2e tests here
    },
  },
];
