import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginNx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export function createCommonTsConfig(tsconfigRootDir) {
  return {
    files: ['**/*.{js,cjs,mjs,ts,tsx,jsx}'],
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: tseslint.parser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
        ecmaFeatures: { jsx: true },
        tsconfigRootDir,
      },
      globals: {
        ...globals.browser,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      '@nx': pluginNx,
    },
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...pluginReact.configs.flat.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/triple-slash-reference': 'off',
      '@next/next/no-html-link-for-pages': ['error', ['apps/dataset-catalog/pages', 'apps/catalog-admin/pages']],
    },
  };
}
