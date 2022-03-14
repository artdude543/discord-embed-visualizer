import typescript from 'rollup-plugin-typescript2';

import pkg from './package.json';

const input = "src/index.tsx";

const external = [
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
    
    // MUI Imports
    '@mui/icons-material/DeleteForever',
    '@mui/icons-material/ExpandLess',
    '@mui/icons-material/ExpandMore',
    '@mui/lab/AdapterDateFns',
    '@mui/lab/DateTimePicker/DateTimePicker',
    '@mui/lab/LocalizationProvider',
    '@mui/material/Button/Button',
    '@mui/material/colors/green',
    '@mui/material/Dialog/Dialog',
    '@mui/material/DialogActions/DialogActions',
    '@mui/material/DialogContent/DialogContent',
    '@mui/material/DialogContentText/DialogContentText',
    '@mui/material/DialogTitle/DialogTitle',
    '@mui/material/FormControlLabel/FormControlLabel',
    '@mui/material/Grid/Grid',
    '@mui/material/IconButton/IconButton',
    '@mui/material/MenuItem/MenuItem',
    '@mui/material/Select/Select',
    '@mui/material/styles',
    '@mui/material/styles/ThemeProvider',
    '@mui/material/Switch/Switch',
    '@mui/material/TextField/TextField',
    '@mui/material/Tooltip/Tooltip',
    '@mui/material/Typography/Typography',
    '@mui/styles',
    '@mui/material/Link/Link',
    '@mui/material/Paper/Paper',
    '@mui/material/Paper/Paper',
    '@mui/material/styles/createTheme',

    // Other
    'react/jsx-runtime',
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