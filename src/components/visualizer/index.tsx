import { Link, Paper, ThemeProvider } from '@material-ui/core';
import { green } from '@material-ui/core/colors';
import { format } from 'date-fns';
import PropTypes from 'prop-types';
import React from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { IEmbed } from '../generator';
import { theme } from '../shared';
import { getFieldGridColumn } from './lib/helpers';
import { authorAndFooterStyles, embedStyles, fieldStyles, imageStyles, visualizerStyles } from './styles';

interface IProps {
    embed: IEmbed;
}

function Visualizer(props: IProps) {
    const { embed } = props;

    const authorAndFooterClasses = authorAndFooterStyles();
    const embedClasses = embedStyles();
    const fieldClasses = fieldStyles();
    const imageClasses = imageStyles();
    const visualizerClasses = visualizerStyles();

    return (
        <ThemeProvider theme={ theme }>
            <div className={ visualizerClasses.root }>
                <Paper className={ visualizerClasses.message }>
                    {
                        /**
                         * Bot User
                         */
                    }
                    <div className={ visualizerClasses.title }>
                        <img className={ visualizerClasses.avatar } src="https://static-cdn.jtvnw.net/jtv_user_pictures/52779398-2481-4700-9648-b94ed5240781-profile_image-70x70.png" />
                        <h1 className={ visualizerClasses.username }>BeepBot</h1>
                        <span className={ visualizerClasses.botBadge }>BOT</span>
                    </div>
                    <Paper
                        elevation={0}
                        className={ embedClasses.root }
                        style={{
                            borderLeftColor: `#${embed?.color}` || green[500],
                            display: 'grid',
                        }}
                    >
                        <div
                            className={ embedClasses.grid }
                        >
                            {
                                /**
                                 * AUTHOR
                                 */
                            }
                            <div className={ authorAndFooterClasses.root }>
                                { embed.author.iconUrl && <img className={ authorAndFooterClasses.icon } src={ embed.author.iconUrl } /> }
                                { embed.author.url
                                    ? <Link className={ authorAndFooterClasses.url } href={ embed.author.url }>{ embed.author.name }</Link>
                                    : embed.author.name
                                }
                            </div>
                            {
                                /**
                                 * BODY
                                 */
                            }
                            <span className={ embedClasses.body }>
                                <div className={ embedClasses.title }>
                                    { embed.body.url
                                        ? <Link className={ embedClasses.url } href={ embed.body.url }>{ embed.body.title }</Link>
                                        : embed.body.title
                                    }
                                </div>
                            </span>
                            <div className={ embedClasses.description }>
                                <ReactMarkdown plugins={[ gfm ]}>{ embed.body.description }</ReactMarkdown>
                            </div>
                            {
                                /**
                                 * FIELDS
                                 */
                            }
                            <div className={ fieldClasses.root }>
                                {
                                    embed.fields.map((field, index) => (
                                        <div key={ `field-${index}` } style={{ gridColumn: getFieldGridColumn(embed.fields, index) }}>
                                            <div className={ fieldClasses.name }>{ field.name }</div>
                                            <div className={ fieldClasses.value }><ReactMarkdown plugins={[ gfm ]}>{ field.value }</ReactMarkdown></div>
                                        </div>
                                    ))
                                }
                            </div>
                            {
                                /**
                                 * IMAGES
                                 */
                            }
                            { embed.image?.url &&
                                <img
                                    className={ imageClasses.image }
                                    src={embed.image.url}
                                    style={{
                                        width: embed.image.width !== 0 && `${embed.image.width}px`,
                                        height: embed.image.height !== 0 && `${embed.image.height}px`,
                                    }}
                                />
                            }
                            {
                                /**
                                 * FOOTER
                                 */
                            }
                            <div className={ authorAndFooterClasses.root }>
                                { embed.footer.iconUrl && <img className={ authorAndFooterClasses.icon } src={ embed.footer.iconUrl } /> }
                                { embed.footer.text }
                                { embed.footer.timestamp && <span>&nbsp;&bull;&nbsp;{ format(new Date(embed.footer.timestamp), "dd/MM/yyyy") }</span> }
                            </div>
                            {
                                /**
                                 * THUMBNAIL
                                 */
                            }
                            { embed.thumbnail?.url &&
                                <img
                                    className={ imageClasses.thumbnail }
                                    src={embed.thumbnail.url}
                                    style={{
                                        width: embed.thumbnail.width !== 0 && `${embed.thumbnail.width}px`,
                                        height: embed.thumbnail.height !== 0 && `${embed.thumbnail.height}px`,
                                    }}
                                />
                            }
                        </div>
                    </Paper>
                </Paper>
            </div>
        </ThemeProvider>
    );
}

Visualizer.propTypes = {
    embed: PropTypes.object.isRequired,
};

export {
    Visualizer
};