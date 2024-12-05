const typescript = require('@rollup/plugin-typescript');
const { terser } = require('rollup-plugin-terser');
const { nodeResolve } = require('@rollup/plugin-node-resolve');
const commonjs = require('@rollup/plugin-commonjs');
const json = require('@rollup/plugin-json');
const dts = require('rollup-plugin-dts').default;
const analyze = require('rollup-plugin-analyzer');

const getEnvironmentConfig = () => ({
    isProduction: process.env.NODE_ENV === 'production'
});

const getExternalDependencies = () => [
    'inversify',
    'reflect-metadata',
    'tslib',
    'http',
    'https',
    'url',
    'querystring'
];

const createPlugins = (isProduction) => [
    nodeResolve({
        preferBuiltins: true,
        browser: true,
        extensions: ['.ts', '.js', '.json']
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
        sourceMap: true,
        include: ['src/**/*.ts'],
        exclude: ['node_modules', 'dist']
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

const createWarningHandler = () => (warning, warn) => {
    const ignoredWarnings = ['THIS_IS_UNDEFINED', 'CIRCULAR_DEPENDENCY'];
    
    if (warning.code && ignoredWarnings.includes(warning.code)) {
        return;
    }
    if (warning.plugin === 'typescript') {
        console.error('TypeScript Error:', warning.message);
        return;
    }
    warn(warning);
};

const createMainBundle = (plugins, external, warningHandler) => ({
    input: 'src/index.ts',
    output: [
        createOutputConfig('cjs', 'cjs'),
        createOutputConfig('esm', 'esm'),
        createOutputConfig('umd', 'umd')
    ],
    plugins,
    external,
    onwarn: warningHandler
});

const createTypeDefinitions = (external, warningHandler) => ({
    input: 'src/types/core.ts',
    output: {
        file: 'dist/index.d.ts',
        format: 'es'
    },
    plugins: [dts()],
    external,
    onwarn: warningHandler
});

const { isProduction } = getEnvironmentConfig();
const external = getExternalDependencies();
const plugins = createPlugins(isProduction);
const warningHandler = createWarningHandler();

module.exports = [
    createMainBundle(plugins, external, warningHandler),
    createTypeDefinitions(external, warningHandler)
];