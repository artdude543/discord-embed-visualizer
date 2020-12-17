import { createMuiTheme, Grid, ThemeProvider } from '@material-ui/core';
import green from '@material-ui/core/colors/green';
import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { Generator, Visualizer } from '.';
import { IEmbed } from './components/generator';

const theme = createMuiTheme({
    palette: {
        primary: {
            main: green[500],
        },
    }
});

const DemoDefaults: IEmbed = {
    author: {
        name: 'TestUser',
        url: 'https://beepbot.app',
        iconUrl: 'https://beepbot.app/img/favicon-32x32.png',
    },
    body: {
        title: 'My Awesome Day Out',
        description: '## Testing\n This is a message on another line?',
        url: '',
    },
    color: '#fff',
    footer: {
        iconUrl: 'https://beepbot.app/img/favicon-32x32.png',
        text: 'via BeepBot \\o\/',
        timestamp: '2020-12-10T00:00:00.000Z'
    },
    image: {
        width: 250,
        height: 300,
        url: 'https://i.imgur.com/fmYrG2N.png',
    },
    thumbnail: {
        width: 0,
        height: 0,
        url: 'https://i.imgur.com/fmYrG2N.png',
    },
    fields: [{
        name: 'Item 1',
        value: "These things have [manual ways](https://discord.dev/reference#message-formatting) ... blah, blah, `d.user`, `d.role`, `d.channel`, and `d.emoji`.",
        inline: true,
    }, {
        name: 'Item 2',
        value: "You can create reaction roles with the bot using the `d.reactionrole` command, the set-up process is very simple: add a reaction to any existing message in your server, and name the role.",
        inline:true,
    }, {
        name: 'Item 3',
        value: "The bot is capable of turning most message links sent inside your server into Discohook links. Use the `d.link` command with a message link to move that message from Discord into Discohook.",
        inline: false,
    }]
};

function App() {
    const [ data, setData ] = useState<IEmbed>(DemoDefaults);

    return (
        <ThemeProvider theme={theme}>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <Generator defaultValue={ DemoDefaults } onChange={ setData } />
                </Grid>
                <Grid item xs={6}>
                    <Visualizer embed={ data } />
                </Grid>
            </Grid>
        </ThemeProvider>
    );
}

ReactDOM.render(<App />, document.getElementById('app'));