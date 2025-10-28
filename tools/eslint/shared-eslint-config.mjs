import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginNx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export function createCommonTsConfig(tsconfigRootDir) {
  return {
    files: ['**/*.{js,cjs,mjs,ts,tsx,jsx}'],
    ignores: ['.next/**/*', 'node_modules/**/*'],
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
    rules: {
      ...tseslint.configs.recommended[0].rules,
      ...pluginReact.configs.flat.recommended.rules,

      // not needed with Next.js / TS
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',

      // prefer TS-aware unused-vars
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
    },
    plugins: {
      '@typescript-eslint': tseslint.plugin,
      react: pluginReact,
      '@nx': pluginNx,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
  };
}
