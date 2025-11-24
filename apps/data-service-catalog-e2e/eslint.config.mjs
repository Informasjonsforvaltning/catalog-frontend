import { FlatCompat } from "@eslint/eslintrc";
import baseConfig from "../../eslint.config.mjs";

const compat = new FlatCompat();

export default [
  ...baseConfig,
  ...compat.extends("plugin:playwright/recommended"),
  {
    files: ["**/*.spec.ts", "**/*.test.ts"],
    rules: {
      "@playwright/no-skipped-test": "error",
      "@playwright/no-focused-test": "error",
      "@playwright/no-conditional-test": "error",
      "@playwright/no-conditional-in-test": "error",
      "@playwright/no-force-option": "error",
      "@playwright/no-wait-for-timeout": "error",
      "@playwright/prefer-web-first-assertions": "error",
      "@playwright/prefer-locator-assertions": "error",
      "@playwright/no-useless-not": "error",
      "@playwright/no-element-handle": "error",
      "@playwright/no-eval": "error",
      "@playwright/no-slow-assertions": "error",
      "@playwright/no-wait-for-selector": "error",
      "@playwright/no-conditional-expect": "error",
      "@playwright/no-conditional-expect-in-test": "error",
      "@playwright/no-conditional-in-test": "error",
      "@playwright/no-conditional-test": "error",
      "@playwright/no-focused-test": "error",
      "@playwright/no-skipped-test": "error",
      "@playwright/no-useless-not": "error",
      "@playwright/prefer-locator-assertions": "error",
      "@playwright/prefer-web-first-assertions": "error",
      "@playwright/no-force-option": "error",
      "@playwright/no-wait-for-timeout": "error",
      "@playwright/no-element-handle": "error",
      "@playwright/no-eval": "error",
      "@playwright/no-slow-assertions": "error",
      "@playwright/no-wait-for-selector": "error",
    },
  },
];
