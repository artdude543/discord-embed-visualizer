import createTheme from '@mui/material/styles/createTheme';

export const theme = createTheme({
    palette: {
        mode: 'dark',
    },
    typography: {
        fontFamily: [
            '"Helvetica Neue"',
            'Helvetica',
            'Arial',
            'sans-serif',
        ].join(','),
    },
    components: {
        MuiTextField: {
            defaultProps: {
                variant: 'standard',
            },
        },
        MuiButton: {
            styleOverrides: {
                containedPrimary: {
                    backgroundColor: 'rgb(114, 137, 218)',
                    borderColor: 'rgb(114, 137, 218)',
                    color: 'rgb(255, 255, 255)',

                    '&:hover': {
                        backgroundColor: 'rgb(142, 160, 225)',
                        borderColor: 'rgb(142, 160, 225)',
                    },
                },
            },
        },
    },
});