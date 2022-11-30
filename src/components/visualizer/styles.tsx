import { makeStyles } from 'tss-react/mui';

export const visualizerStyles = makeStyles({ name: 'VisualizerStyles' })({
    root: {
        fontFamily: 'Whitney, "Helvetica Neue", Helvetica, Arial, sans-serif',
    },
    message: {
        padding: '.5rem 1rem .5rem 4.5rem',
    },
    title: {
        display: 'inline-block',
        lineHeight: '1.375rem',
        minHeight: '1.375rem',
        whiteSpace: 'break-spaces',
        position: 'relative',
        marginLeft: '-4.5rem',
        marginBottom: '.3rem',
        paddingLeft: '4.5rem',
    },
    username: {
        display: 'inline',
        verticalAlign: 'baseline',
        margin: '0px .25rem 0px 0px',
        color: 'rgb(255, 255, 255)',
        fontSize: '1rem',
        fontWeight: 500,
        lineHeight: '1.375rem',
        overflowWrap: 'break-word',
        cursor: 'pointer',
    },
    botBadge: {
        position: 'relative',
        top: '-0.1rem',
        minHeight: '1.275em',
        maxHeight: '1.275em',
        margin: '.075em .25rem 0px 0px',
        padding: '.071875rem .275rem',
        borderRadius: '3px',
        background: 'rgb(114, 137, 218)',
        color: 'rgb(255, 255, 255)',
        fontSize: '0.625em',
        fontWeight: 500,
        lineHeight: 1.3,
        verticalAlign: 'baseline',
    },
    avatar: {
        height: '2.5rem',
        width: '2.5rem',
        position: 'absolute',
        left: 0,
        top: '0.125rem',
        margin: '0 1rem',
        borderRadius: '50%',
        objectFit: 'cover',
    },
});

export const embedStyles = makeStyles({ name: 'EmbedStyles' })({
    root: {
        maxWidth: '520px',
        borderLeftWidth: '4px',
        borderLeftStyle: 'solid',
        backgroundColor: '#2F3136',
        color: '#FFF',
    },
    grid: {
        padding: '.5rem 1rem 1rem .75rem',
        display: 'inline-grid',
        gridTemplateColumns: 'auto',
        gridTemplateRows: 'row',
    },
    wrapper: {
        minWidth: '0px',
        display: 'inline-block',
        margin: '8px 0px 0px',
        gridColumn: '1 / 2',
    },
    body: {},
    title: {
        fontSize: '1rem',
        fontWeight: 600,
        margin: '8px 0px 0px',
        color: 'rgb(255, 255, 255)',
    },
    url: {
        color: '#00b0f4',
    },
    description: {
        minWidth: '0px',
        margin: '8px 0px 0px',
        gridColumn: '1 / 2',
    },
});

export const authorAndFooterStyles = makeStyles({ name: 'AuthorFooterStyles' })({
    root: {
        fontSize: '0.875rem',
        fontWeight: 500,
        minWidth: '0px',
        display: 'flex',
        boxAlign: 'center',
        alignItems: 'center',
        gridColumn: '1 / 2',
        margin: '8px 0px 0px',
    },
    icon: {
        height: '24px',
        width: '24px',
        margin: '0px 8px 0px 0px',
        objectFit: 'contain',
        borderRadius: '50%',
    },
    url: {
        color: 'rgb(255, 255, 255)',
        whiteSpace: 'pre-wrap',
        display: 'inline-block',
    },
});

export const fieldStyles = makeStyles({ name: 'FieldStyles' })((theme: any) => ({
    root: {
        // minWidth: '0px',
        // margin: '8px 0px 0px',
        minWidth: 0,
        margin: '8px 0px, 0px',
        display: 'grid',
        gridColumn: 1 / 2,
        gridGap: 8,
    },
    chunk: {
        display: 'grid',
    },
    field: {
        minWidth: '0px',
        fontSize: '0.875rem',
        lineHeight: '1.125rem',
    },
    name: {
        minWidth: '0px',
        margin: '0px 0px 1px',
        fontSize: '0.875rem',
        fontWeight: 600,
        color: 'rgb(255, 255, 255)',
        whiteSpace: 'pre-wrap',
        overflowWrap: 'break-word',
    },
    value: {
        fontSize: '.875rem',
        lineHeight: '1.125rem',
        color: 'rgb(220, 221, 222)',
        whiteSpace: 'pre-line',

        '& code': {
            backgroundColor: '#202225',
            borderRadius: 2,
            padding: theme.spacing(.2),
        },
        '& a': {
            color: '#00b0f4',
            textDecoration: 'none',
        },
    },
}));

export const imageStyles = makeStyles({ name: 'ImageStyles' })({
    root: {
        gridColumn: '1 / 2',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gridTemplateRows: '1fr 1fr',
        gap: '4px',
        height: '300px',
        marginTop: '16px',
        borderRadius: '4px',
        overflow: 'hidden',
    },
    image: {
        borderRadius: '4px',
        maxWidth: '100%',
        userSelect: 'none',
        userDrag: 'none',
    },
    thumbnail: {
        maxWidth: 80,
        maxHeight: 80,
        borderRadius: 4,
        margin: '8px 0px 0px 16px',
        justifySelf: 'end',
        cursor: 'pointer',
        gridArea: '1 / 2 / 8 / 3',
        userSelect: 'none',
        userDrag: 'none',
    }
});