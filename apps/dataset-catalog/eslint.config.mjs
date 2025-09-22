import { defineConfig, globalIgnores } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import pluginReact from 'eslint-plugin-react';
import pluginNx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default defineConfig([
  globalIgnores(['.next/**/*', 'node_modules/**/*']),

  {
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
      '@next/next/no-html-link-for-pages': ['error', 'apps/dataset-catalog/pages'],
    },
  },
  {
    ignores: ['.next', '.next/**/*', '**/.next/**/*', 'node_modules/**/*'],
  },
  {
    files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
    rules: {
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: [],
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  },

  // Ekstra override for å skru av next-regel globalt i andre apps
  {
    rules: {
      '@next/next/no-html-link-for-pages': 'off',
      'react/react-in-jsx-scope': 'off',
    },
  },
]);
