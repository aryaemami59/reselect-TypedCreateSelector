import { FlatCompat } from '@eslint/eslintrc'
import js from '@eslint/js'
import tsEslint from '@typescript-eslint/eslint-plugin'
// @ts-expect-error
import tsParser from '@typescript-eslint/parser'
import globals from 'globals'
// import path from "path";
// import { fileURLToPath } from "url";

// const __filename = fileURLToPath(import.meta.url)
// const __dirname = path.dirname(__filename)

const compat = new FlatCompat({
  // baseDirectory: __dirname,
  // resolvePluginsRelativeTo: __dirname
})

// console.log(tsEslint.configs.recommended)
// console.log(tsEslint.configs['eslint-recommended'])

/**
 * @type {import('eslint').Linter.FlatConfig[]}
 */
const config = [
  {
    ignores: [
      'eslint.config.js',
      'lib',
      'es',
      'node_modules',
      'vitest.config.ts',
      'tsup.config.ts',
      '**/build',
      '**/dist',
      '.tsup',
      '**/.docusaurus'
    ]
  },
  js.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        sourceType: 'module',
        ecmaVersion: 2015
      }
    },
    rules: {
      strict: 0
    }
  },
  ...compat.config(tsEslint.configs['eslint-recommended']),
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        project: true
      },
      globals: globals.jest
    },
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-shadow': ['off'],
      '@typescript-eslint/no-use-before-define': ['off'],
      '@typescript-eslint/ban-types': 'off',
      'prefer-rest-params': 'off',
      'prefer-spread': 'off',
      '@typescript-eslint/consistent-type-imports': [
        2,
        { fixStyle: 'separate-type-imports' }
      ],
      '@typescript-eslint/consistent-type-exports': [2]
    }
  },
  {
    files: ['**/test/**/*.ts', '**/typescript_test/**/*.ts'],
    rules: {
      'consistent-return': 'off',
      'max-lines': 'off',
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      '@typescript-eslint/no-shadow': 'off'
    }
  },
  {
    files: ['./docs/examples/**/*.{js,ts,jsx,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2023,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    rules: {
      'no-unused-vars': [0]
    }
  }
]

export default config
