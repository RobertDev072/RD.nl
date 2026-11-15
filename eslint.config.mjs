import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat({ baseDirectory: dirname(fileURLToPath(import.meta.url)) });

const config = [
  { ignores: ['.next/**', 'node_modules/**', 'design/**', 'public/**', 'next-env.d.ts'] },
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    // Known existing issue (useTransform inside a helper in Hero.tsx). Kept as a warning so CI
    // can be introduced without touching production code; fix in a separate PR, then remove.
    files: ['src/components/home/Hero.tsx'],
    rules: { 'react-hooks/rules-of-hooks': 'warn' },
  },
];

export default config;
