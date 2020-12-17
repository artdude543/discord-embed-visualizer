import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const input = "src/index.tsx";

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    '@material-ui/core/colors',
    '@material-ui/pickers/adapter/date-fns',
    '@material-ui/icons/DeleteForever',
    '@material-ui/icons/ExpandLess',
    '@material-ui/icons/ExpandMore',
    'react/jsx-runtime'
];

const plugins = [
    typescript({
        typescript: require("typescript"),
    }),
];

export default [
    {
        input,
        output: {
            file: pkg.module,
            format: "esm",
            sourcemap: true,
        },
        plugins,
        external,
    },
    {
        input,
        output: {
            file: pkg.main,
            format: "cjs",
            sourcemap: true,
        },
        plugins,
        external,
    },
];