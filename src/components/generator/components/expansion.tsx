import {
    Accordion as MuiAccordion, AccordionDetails as MuiAccordionDetails,
    AccordionSummary as MuiAccordionSummary
} from '@mui/material';
import { withStyles } from '@mui/styles';

export const Accordion = withStyles({
    root: {
        border: '1px solid rgba(0, 0, 0, .125)',
        boxShadow: 'none',
        '&:not(:last-child)': {
            borderBottom: 0,
        },
        '&:before': {
            display: 'none',
        },
        '&$expanded': {
            margin: 'auto',
        },
        background: '#2f3136',
    },
    expanded: {},
})(MuiAccordion);

export const AccordionSummary = withStyles({
    root: {
        backgroundColor: 'rgba(0, 0, 0, .15)',
        borderBottom: '1px solid rgba(0, 0, 0, .125)',
        marginBottom: -1,
        minHeight: 56,
        '&$expanded': {
            minHeight: 56,
        },
    },
    content: {
        '&$expanded': {
            margin: '12px 0',
        },
    },
    expanded: {},
})(MuiAccordionSummary);

export const AccordionDetails = withStyles(theme => ({
    root: {
      padding: theme.spacing(2),
    },
}))(MuiAccordionDetails);