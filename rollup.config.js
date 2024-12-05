const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const resolve = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const dts = require('rollup-plugin-dts');
const analyze = require('rollup-plugin-analyzer');

const isProduction = process.env.NODE_ENV === 'production';

const external = [
    'inversify',
    'reflect-metadata',
    'tslib',
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
].filter(Boolean);

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

const handleWarnings = (warning, warn) => {
    const ignoredWarnings = [
        'THIS_IS_UNDEFINED',
        'CIRCULAR_DEPENDENCY'
    ];
    
    if (warning.code && ignoredWarnings.includes(warning.code)) {
        return;
    }

    if (warning.plugin === 'typescript') {
        console.error('TypeScript Error:', warning.message);
        return;
    }

    warn(warning);
};

module.exports = [
    {
        input: 'src/index.ts',
        output: [
            createOutputConfig('cjs', 'cjs'),
            createOutputConfig('esm', 'esm'),
            createOutputConfig('umd', 'umd')
        ],
        plugins,
        external,
        onwarn: handleWarnings
    },
    {
        input: 'src/types/core.ts',
        output: {
            file: 'dist/index.d.ts',
            format: 'es'
        },
        plugins: [dts()],
        external,
        onwarn: handleWarnings
    }
];