import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import dts from 'rollup-plugin-dts';
import analyze from 'rollup-plugin-analyzer';
import { defineConfig } from 'rollup';

const isProduction = process.env.NODE_ENV === 'production';

const external = [
  // Node.js built-ins that might be used for geolocation
  'http',
  'https',
  'url',
  'querystring',
  // Add any external dependencies here once added to package.json
];

const plugins = [
  resolve({
    preferBuiltins: true,
    browser: true,
  }),
  commonjs(),
  json(),
  typescript({
    tsconfig: './tsconfig.json',
    declaration: true,
    declarationDir: './dist/types',
  }),
  isProduction && terser({
    compress: {
      pure_funcs: ['console.log', 'console.debug'],
      drop_debugger: true,
    }
  }),
  analyze({
    summaryOnly: true,
    limit: 10,
  }),
];

const createOutputConfig = (format, suffix) => ({
  file: `dist/lorentz-clock.${suffix}.js`,
  format,
  sourcemap: true,
  name: 'LorentzClock',
  exports: 'named',
  globals: {
    // Add global variables for UMD build if needed
  },
});

export default defineConfig([
  // Main builds
  {
    input: 'src/index.ts',
    output: [
      createOutputConfig('cjs', 'cjs'),
      createOutputConfig('esm', 'esm'),
      createOutputConfig('umd', 'umd'),
    ],
    plugins,
    external,
  },
  // Types bundle
  {
    input: 'dist/types/index.d.ts',
    output: {
      file: 'dist/index.d.ts',
      format: 'es',
    },
    plugins: [dts()],
  },
]);