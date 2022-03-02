import {
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    FormControlLabel,
    Grid,
    IconButton,
    makeStyles,
    MenuItem,
    Select,
    Switch,
    TextField,
    ThemeProvider,
    Tooltip,
    Typography
} from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import ExpandLessIcon from '@material-ui/icons/ExpandLess';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { DateTimePicker, LocalizationProvider } from '@material-ui/pickers';
import DateFnsUtils from '@material-ui/pickers/adapter/date-fns';
import debounce from 'debounce';
import { ColorPicker } from 'material-ui-color';
import PropTypes from 'prop-types';
import React, { useEffect, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import gfm from 'remark-gfm';

import { theme } from '../shared';
import { Accordion, AccordionDetails, AccordionSummary } from './components/expansion';
import { copyToClipBoard, ExporterType, generateExport } from './lib/helpers';

export interface IAuthor {
    name?: string;
    iconUrl?: string;
    url?: string;
}

export interface IBody {
    title?: string;
    description?: string;
    url?: string;
}

export interface IFooter {
    iconUrl?: string;
    text: string;
}

export interface IField {
    name: string;
    value: string;
    inline?: boolean;
}

export interface IImage {
    url?: string;
    width?: number;
    height?: number;
}

export interface IEmbed extends IBody {
    author?: IAuthor;
    color?: string;
    fields?: IField[];
    image?: IImage;
    thumbnail?: IImage;
    timestamp?: string;
    footer?: IFooter;
}

interface IHiddenField {
    author?: boolean;
    body?: boolean;
    fields?: boolean;
    images?: boolean;
    footer?: boolean;
}

interface IProps {
    defaultValue: IEmbed;
    showExportSection?: boolean;
    hideFields?: IHiddenField;

    onChange: (data: IEmbed) => void;
}

const styles = makeStyles(theme => ({
    buttonGroup: {
        position: 'absolute',
        right: 60,
        paddingRight: 8,
        top: 4,
    },
    controlPadding: {
        paddingTop: `${theme.spacing(2)} !important`,
    },
    fieldRoot: {
        paddingBottom: theme.spacing(2),
    },
    exportField: {
        userSelect: 'none',
        margin: '-8px 0 -12px 0',

        '& > div::before': {
            display: 'none',
        },
        '& > pre': {
            overflow: 'hidden !important',
        },
    },
}));

const renderers = {
    code: ({ language, value }: { language: string; value: React.ReactNode }) => {
      return <SyntaxHighlighter style={ materialDark } language={ language } children={ value } />
    },
};

function setEmbedDefaults(incoming: Partial<IEmbed>): IEmbed {
    return {
        author: {
            name: incoming.author != null && incoming.author.name != null ? incoming.author.name : '',
            iconUrl: incoming.author != null && incoming.author.iconUrl != null ? incoming.author.iconUrl : '',
            url: incoming.author != null && incoming.author.url != null ? incoming.author.url : '',
        },
        color: incoming.color != null && incoming.color != null ? incoming.color : '#fff',
        description: incoming.description != null ? incoming.description : '',
        fields: incoming.fields != null ? incoming.fields : [],
        footer: {
            iconUrl: incoming.footer != null && incoming.footer.iconUrl != null ? incoming.footer.iconUrl : '',
            text: incoming.footer != null && incoming.footer.text != null ? incoming.footer.text : '',
        },
        image: {
            url: incoming.image != null && incoming.image.url != null ? incoming.image.url : '',
            width: incoming.image != null && incoming.image.url != null ? incoming.image.width : 0,
            height: incoming.image != null && incoming.image.url != null ? incoming.image.height : 0,
        },
        thumbnail: {
            url: incoming.thumbnail != null && incoming.thumbnail.url != null ? incoming.thumbnail.url : '',
            width: incoming.thumbnail != null && incoming.thumbnail.url != null ? incoming.thumbnail.width : 0,
            height: incoming.thumbnail != null && incoming.thumbnail.url != null ? incoming.thumbnail.height : 0,
        },
        timestamp: incoming.timestamp != null ? incoming.timestamp : undefined,
        title: incoming.title != null ? incoming.title : '',
        url: incoming.url != null ? incoming.url : '',
    };
}

function setFieldDefaults(incoming: IHiddenField) {
    return {
        author: incoming?.author ?? false,
        body: incoming?.body ?? false,
        fields: incoming?.fields ?? false,
        images: incoming?.images ?? false,
        footer: incoming?.footer ?? false,
    };
}

function Generator(props: IProps) {
    const { defaultValue, hideFields, showExportSection, onChange } = props;

    const defaultWithSet = setEmbedDefaults(defaultValue);
    const shouldHideFields = setFieldDefaults(hideFields);

    const [ expanded, setExpanded ] = useState<string | boolean>(false);
    const [ fieldExpanded, setFieldExpanded ] = useState<string | boolean>(false);

    const [ author, setAuthor ] = useState<IAuthor>({ ...defaultWithSet?.author });
    const [ color, setColor ] = useState<string>(defaultWithSet?.color);
    const [ description, setDescription ] = useState<string>(defaultWithSet?.description);
    const [ fields, setFields ] = useState<IField[]>(defaultWithSet?.fields);
    const [ footer, setFooter ] = useState<IFooter>({ ...defaultWithSet?.footer });
    const [ image, setImage ] = useState<IImage>({ ...defaultWithSet?.image });
    const [ thumbnail, setThumbnail ] = useState<IImage>({ ...defaultWithSet?.thumbnail });
    const [ timestamp, setTimestamp ] = useState<string>(defaultWithSet?.timestamp);
    const [ title, setTitle ] = useState<string>(defaultWithSet?.title);
    const [ url, setUrl ] = useState<string>(defaultWithSet?.url);

    const [ copied, setCopied ] = useState<boolean>(false);
    const [ showExport, setShowExport ] = useState<boolean>(false);
    const [ exporter, setExporter ] = useState<ExporterType>('discordjs');

    const classes = styles();

    const handleAccordian = (panel: string)  => (_evnt: React.ChangeEvent<{}>, isExpanded: boolean) => setExpanded(isExpanded ? panel : false);
    const handleFieldAccordian = (panel: string)  => (_evnt: React.ChangeEvent<{}>, isExpanded: boolean) => setFieldExpanded(isExpanded ? panel : false);

    const handleFieldAdd = () => {
        if (fields.length > 24) {
            return;
        }

        setFields(preValues => [ ...preValues, { name: '', value: '', inline: false } ]);
    }
    const handleFieldDelete = (index: number) => {
        const fieldsClone = [ ...fields ];
        fieldsClone.splice(index, 1);

        setFields(fieldsClone);
    };
    const handleFieldMove = (index: number, direction: 'up' | 'down') => {
        const fieldsClone = [ ...fields ];
        const toMove = { ...fieldsClone[index] };
        const toReplace = { ...fieldsClone[direction === 'up' ? index - 1 : index + 1] };
        
        fieldsClone[index] = toReplace;
        fieldsClone[direction === 'up' ? index - 1 : index + 1] = toMove;

        setFields(fieldsClone);
    };
    
    const exportedData = generateExport(exporter, { author, color, description, fields, footer, image, thumbnail, timestamp, title, url });
    const handleExport = () => setShowExport(true);

    const sendChanges = debounce(onChange, 300);
    
    useEffect(() => {
        let isLoaded = true;

        if (isLoaded && onChange != null) {
            sendChanges({ author, color, description, fields, footer, image, thumbnail, timestamp, title, url });
        }

        return () => {
            isLoaded = false;
        }
    }, [ author, color, description, fields, footer, image, thumbnail, timestamp, title, url ]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setCopied(false);
        }, 3000);

        return () => clearTimeout(timer);
    }, [ copied ]);

    return (
        <ThemeProvider theme={ theme }>
            <LocalizationProvider dateAdapter={ DateFnsUtils }>
                <div>
                    <Dialog open={ showExport } onClose={ (_, reason) => reason !== 'backdropClick' ? setShowExport(false) : undefined } disableEscapeKeyDown maxWidth="md" fullWidth>
                        <DialogTitle>{ exporter } Embed Data</DialogTitle>
                        <DialogContent dividers style={{ padding: 'unset' }}>
                            <DialogContentText component="div">
                                <ReactMarkdown
                                    renderers={ renderers }
                                    plugins={[ gfm ]}
                                    className={ classes.exportField }
                                >
                                    {'```json\n' +
                                        JSON.stringify(
                                            exportedData,
                                            null,
                                            2,
                                        )
                                    + '\n```'}
                                </ReactMarkdown>
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button color="secondary" autoFocus variant="contained" onClick={ () => setShowExport(false) }>Close</Button>
                            <Button
                                color="primary"
                                style={{ backgroundColor: copied && green[500] }}
                                variant="contained"
                                onClick={ () =>
                                    copyToClipBoard(
                                        JSON.stringify(
                                            exportedData
                                        ),
                                        () => setCopied(true),
                                    )}
                            >
                                { !copied ? 'Copy To Clipboard' : 'Copied!' }
                            </Button>
                        </DialogActions>
                    </Dialog>
                    {
                        shouldHideFields['author'] === false && (
                            <Accordion expanded={ expanded === 'author' } onChange={ handleAccordian('author') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Author</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 12 }>
                                            <TextField
                                                value={ author.name }
                                                onChange={ evnt => setAuthor(preValues => { return { ...preValues, name: String(evnt.target.value)}}) }
                                                label={ `Author ${author.name?.length || 0}/256` }
                                                fullWidth
                                                error={ (author.name?.length || 0) >= 256 }
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <TextField
                                                value={ author.url }
                                                onChange={ evnt => setAuthor(preValues => { return { ...preValues, url: String(evnt.target.value)}}) }
                                                label="Author URL"
                                                helperText="Can be a link to your social media or personal website."
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <TextField
                                                value={ author.iconUrl }
                                                onChange={ evnt => setAuthor(preValues => { return { ...preValues, iconUrl: String(evnt.target.value)}}) }
                                                label="Author Icon URL"
                                                helperText="Full path to an image hosted online."
                                                fullWidth
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    {
                        shouldHideFields['body'] === false && (
                            <Accordion expanded={ expanded === 'body' } onChange={ handleAccordian('body') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Body</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 12 }>
                                            <TextField
                                                value={ title }
                                                onChange={ evnt => setTitle(String(evnt.target.value)) }
                                                label={ `Title ${title?.length || 0}/256` }
                                                fullWidth
                                                error={ (title?.length || 0) >= 256 }
                                            />
                                        </Grid>
                                        <Grid item xs={ 12 }>
                                            <TextField
                                                value={ description }
                                                onChange={ evnt => setDescription(String(evnt.target.value)) }
                                                label={ `Description ${description?.length || 0}/2048` }
                                                helperText="Supports Discord Markdown Formatting"
                                                fullWidth
                                                error={ (description?.length || 0) >= 2048 }
                                                multiline
                                                rows={ 6 }
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <TextField
                                                value={ url }
                                                onChange={ evnt => setUrl(String(evnt.target.value)) }
                                                label="URL"
                                                helperText="This will make the title clickable."
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <FormControlLabel
                                                control={
                                                    <ColorPicker
                                                        value={ color }
                                                        onChange={ newColor => setColor(String(newColor.hex)) }
                                                        deferred
                                                    />
                                                }
                                                label="Colour:"
                                                labelPlacement="start"
                                                className={ classes.controlPadding }
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    {
                        shouldHideFields['fields'] === false && (
                            <Accordion expanded={ expanded === 'fields' } onChange={ handleAccordian('fields') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Fields</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container className={ classes.fieldRoot }>
                                        <Grid item xs={ 12 }>
                                            {
                                                fields != null && fields.map((field, index) => (
                                                    <Accordion key={ `field-${index}` } expanded={ fieldExpanded === `field-${index}` } onChange={ handleFieldAccordian(`field-${index}`) }>
                                                        <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                                            <Typography variant="body1">Field { index + 1 } -- { field.name }</Typography>
                                                            <div className={ classes.buttonGroup }>
                                                                {
                                                                    index !== 0 && (
                                                                        <IconButton
                                                                            onClick={ evnt => {
                                                                                evnt.stopPropagation();
                                                                                handleFieldMove(index, 'up');
                                                                            }}
                                                                            onFocus={ evnt => evnt.stopPropagation() }
                                                                        >
                                                                            <Tooltip title="Move Up">
                                                                                <ExpandLessIcon />
                                                                            </Tooltip>
                                                                        </IconButton>
                                                                    )
                                                                }
                                                                {
                                                                    index !== fields.length - 1 && (
                                                                        <IconButton
                                                                            onClick={ evnt => {
                                                                                evnt.stopPropagation();
                                                                                handleFieldMove(index, 'down');
                                                                            }}
                                                                            onFocus={ evnt => evnt.stopPropagation() }
                                                                        >
                                                                            <Tooltip title="Move Down">
                                                                                <ExpandMoreIcon />
                                                                            </Tooltip>
                                                                        </IconButton>
                                                                    )
                                                                }
                                                                <IconButton
                                                                    onClick={ evnt => {
                                                                        evnt.stopPropagation();
                                                                        handleFieldDelete(index);
                                                                    }}
                                                                    onFocus={ evnt => evnt.stopPropagation() }
                                                                >
                                                                    <Tooltip title="Delete Field">
                                                                        <DeleteForeverIcon />
                                                                    </Tooltip>
                                                                </IconButton>
                                                            </div>
                                                        </AccordionSummary>
                                                        <AccordionDetails>
                                                            <Grid container spacing={ 2 }>
                                                                <Grid item xs={ 10 }>
                                                                    <TextField
                                                                        value={ fields[index].name }
                                                                        onChange={ evnt => {
                                                                            setFields(preValues => {
                                                                                const cloneData = [ ...preValues ];
                                                                                cloneData[index].name = String(evnt.target.value);

                                                                                return cloneData;
                                                                            });
                                                                        }}
                                                                        label={ `Field Name ${fields[index].name.length}/256` }
                                                                        fullWidth
                                                                        error={ fields[index].name.length < 1 || fields[index].name.length >= 256 }
                                                                        required
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={ 2 } className={ classes.controlPadding }>
                                                                    <FormControlLabel
                                                                        control={
                                                                            <Switch
                                                                                checked={ field.inline }
                                                                                onChange={ (_, checked) => {
                                                                                    setFields(preValues => {
                                                                                        const cloneData = [ ...preValues ];
                                                                                        cloneData[index].inline = checked;
                
                                                                                        return cloneData;
                                                                                    });
                                                                                }}
                                                                            />
                                                                        }
                                                                        label="Inline"
                                                                    />
                                                                </Grid>
                                                                <Grid item xs={ 12 }>
                                                                    <TextField
                                                                        value={ fields[index].value }
                                                                        onChange={ evnt => {
                                                                            setFields(preValues => {
                                                                                const cloneData = [ ...preValues ];
                                                                                cloneData[index].value = String(evnt.target.value);

                                                                                return cloneData;
                                                                            });
                                                                        }}
                                                                        label={ `Field Value ${fields[index].value.length}/1024` }
                                                                        fullWidth
                                                                        error={ fields[index].value.length >= 1024 }
                                                                        required
                                                                        multiline
                                                                        rows={ 6 }
                                                                    />
                                                                </Grid>
                                                            </Grid>
                                                        </AccordionDetails>
                                                    </Accordion>
                                                ))
                                            }
                                        </Grid>
                                    </Grid>
                                    <Button variant="contained" onClick={ handleFieldAdd } disabled={ fields != null ? fields.length === 25 : false }>Add Field</Button>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    {
                        shouldHideFields['images'] === false && (
                            <Accordion expanded={ expanded === 'image' } onChange={ handleAccordian('image') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Images</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 8 }>
                                            <TextField
                                                value={ image.url }
                                                onChange={ evnt => setImage(preValues => { return { ...preValues, url: String(evnt.target.value)}}) }
                                                label="Image URL"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={ 2 }>
                                            <TextField
                                                value={ image.height }
                                                onChange={ evnt => setImage(preValues => { return { ...preValues, height: Number(evnt.target.value)}}) }
                                                label="Image Height"
                                                fullWidth
                                                type="number"
                                                inputProps={{
                                                    step: 1,
                                                    min: 0
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={ 2 }>
                                        <TextField
                                                value={ image.width }
                                                onChange={ evnt => setImage(preValues => { return { ...preValues, width: Number(evnt.target.value)}}) }
                                                label="Image Width"
                                                fullWidth
                                                type="number"
                                                inputProps={{
                                                    step: 1,
                                                    min: 0
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={ 8 }>
                                            <TextField
                                                value={ thumbnail.url }
                                                onChange={ evnt => setThumbnail(preValues => { return { ...preValues, url: String(evnt.target.value)}}) }
                                                label="Thumbnail URL"
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={ 2 }>
                                            <TextField
                                                value={ thumbnail.height }
                                                onChange={ evnt => setThumbnail(preValues => { return { ...preValues, height: Number(evnt.target.value)}}) }
                                                label="Thumbnail Height"
                                                fullWidth
                                                type="number"
                                                inputProps={{
                                                    step: 1,
                                                    min: 0
                                                }}
                                            />
                                        </Grid>
                                        <Grid item xs={ 2 }>
                                        <TextField
                                                value={ thumbnail.width }
                                                onChange={ evnt => setThumbnail(preValues => { return { ...preValues, width: Number(evnt.target.value)}}) }
                                                label="Thumbnail Width"
                                                fullWidth
                                                type="number"
                                                inputProps={{
                                                    step: 1,
                                                    min: 0
                                                }}
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    {
                        shouldHideFields['footer'] === false && (
                            <Accordion expanded={ expanded === 'footer' } onChange={ handleAccordian('footer') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Footer</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 12 }>
                                            <TextField
                                                value={ footer.text }
                                                onChange={ evnt => setFooter(preValues => { return { ...preValues, text: String(evnt.target.value)}}) }
                                                label={ `Footer ${footer.text?.length || 0}/256` }
                                                fullWidth
                                                error={ (footer.text?.length || 0) >= 256 }
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <TextField
                                                value={ footer.iconUrl }
                                                onChange={ evnt => setFooter(preValues => { return { ...preValues, iconUrl: String(evnt.target.value)}}) }
                                                label="Footer Icon URL"
                                                helperText="Full path to an icon to use on the footer."
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <DateTimePicker
                                                renderInput={ props => <TextField fullWidth { ...props } />}
                                                value={ timestamp }
                                                onChange={ date => {
                                                    if (date != null) {
                                                        setTimestamp(new Date(date).toString());
                                                    }
                                                }}
                                                label="Timestamp"
                                            />
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                    {
                        showExportSection && (
                            <Accordion expanded={ expanded === 'export' } onChange={ handleAccordian('export') }>
                                <AccordionSummary expandIcon={ <ExpandMoreIcon /> }>
                                    <Typography variant="h5">Export</Typography>
                                </AccordionSummary>
                                <AccordionDetails>
                                    <Grid container spacing={ 2 }>
                                        <Grid item xs={ 6 }>
                                            <Select fullWidth value={ exporter } onChange={ evnt => setExporter(evnt.target.value) }>
                                                <MenuItem value="discordjs">Discord.js</MenuItem>
                                            </Select>
                                        </Grid>
                                        <Grid item xs={ 6 }>
                                            <Button variant="contained" onClick={ handleExport }>Export</Button>
                                        </Grid>
                                    </Grid>
                                </AccordionDetails>
                            </Accordion>
                        )
                    }
                </div>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

Generator.propTypes = {
    defaultValue: PropTypes.object.isRequired,
    export: PropTypes.bool,
    onChange: PropTypes.func.isRequired,
};

Generator.defaultProps = {
    defaultValue: {},
    showExportSection: true,
    onChange: null,
};

export {
    Generator,
}