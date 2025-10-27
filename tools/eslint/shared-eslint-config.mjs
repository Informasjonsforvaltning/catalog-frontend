import globals from 'globals';
import pluginReact from 'eslint-plugin-react';
import pluginNx from '@nx/eslint-plugin';
import tseslint from 'typescript-eslint';

export function createCommonTsConfig(tsconfigRootDir, allow) {
  const allowList = ['tools', ...(allow || [])];

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
      'react/react-in-jsx-scope': 'off', // not needed with Next.js
      'react/prop-types': 'off', // we use TypeScript for type checking
      '@typescript-eslint/no-unused-vars': 'warn',
      '@nx/enforce-module-boundaries': [
        'error',
        {
          enforceBuildableLibDependency: true,
          allow: allowList,
          depConstraints: [
            {
              sourceTag: '*',
              onlyDependOnLibsWithTags: ['*'],
            },
          ],
        },
      ],
    },
  };
}
