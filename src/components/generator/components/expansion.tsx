import {
    Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary, styled
} from '@mui/material';

export const Accordion = styled(MuiAccordion)(({
    border: '1px solid rgba(0, 0, 0, .125)',
    boxShadow: 'none',
    '&:not(:last-child)': {
        borderBottom: 0,
    },
    '&:before': {
        display: 'none',
    },
    '& .Mui-expanded': {
        margin: 'auto',
    },
    background: '#2f3136',
}));

export const AccordionSummary = styled(MuiAccordionSummary)({
    backgroundColor: 'rgba(0, 0, 0, .15)',
    borderBottom: '1px solid rgba(0, 0, 0, .125)',
    marginBottom: -1,
    minHeight: 56,
    '& .Mui-expanded': {
        margin: '12px 0',
    },
});

export const AccordionDetails = styled(MuiAccordionDetails)(
    ({ theme }) => ({
        padding: theme.spacing(2),
    }),
);
