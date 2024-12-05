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
    // External dependencies
    'inversify',
    'reflect-metadata',
    'tslib',
    
    // Node.js built-ins
    'http',
    'https',
    'url',
    'querystring'
];

const plugins = [
    resolve({
        preferBuiltins: true,
        browser: true
    }),
    commonjs({
        include: 'node_modules/**',
        requireReturnsDefault: 'auto'
    }),
    json(),
    typescript({
        tsconfig: './tsconfig.json',
        declaration: true,
        declarationDir: './dist/types',
        module: 'esnext',
        sourceMap: true
    }),
    isProduction && terser({
        compress: {
            pure_funcs: ['console.log', 'console.debug'],
            drop_debugger: true,
            drop_console: true
        },
        format: {
            comments: false
        }
    }),
    analyze({
        summaryOnly: true,
        limit: 10,
        filterSizes: 1024
    })
];

const createOutputConfig = (format, suffix) => ({
    file: `dist/lorentz-clock.${suffix}.js`,
    format,
    sourcemap: true,
    name: 'LorentzClock',
    exports: 'named',
    globals: {
        'inversify': 'InversifyJS',
        'reflect-metadata': 'Reflect',
        'tslib': 'tslib'
    },
    interop: 'auto',
    generatedCode: {
        arrowFunctions: true,
        constBindings: true,
        objectShorthand: true
    }
});

export default defineConfig([
    {
        input: 'src/index.ts',
        output: [
            createOutputConfig('cjs', 'cjs'),
            createOutputConfig('esm', 'esm'),
            createOutputConfig('umd', 'umd')
        ],
        plugins,
        external,
        onwarn(warning, warn) {
            if (warning.code === 'THIS_IS_UNDEFINED') return;
            warn(warning);
        }
    },
    {
        input: 'src/index.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es'
        },
        plugins: [dts()],
        external
    }
]);