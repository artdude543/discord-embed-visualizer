# Discord Embed Visualizer


<div align="center">

[React](https://reactjs.org/) component for generating and visualizing Discord Embeds

[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)
![](https://img.shields.io/npm/v/discord-embed-visualizer/latest.svg)

![](https://img.shields.io/npm/dt/discord-embed-visualizer.svg)
![](https://img.shields.io/npm/dw/discord-embed-visualizer.svg)

![](https://img.shields.io/github/issues/artdude543/discord-embed-visualizer?maxAge=2592000&v=2.0.6)
![](https://isitmaintained.com/badge/resolution/artdude543/discord-embed-visualizer.svg)

</div>

---

## Installation

```bash
// Via NPM
npm install discord-embed-visualizer

// Via Yarn
yarn add discord-embed-visualizer
```

---

## Usage

```ts
import { Generator, Visualizer } from 'discord-embed-visualizer';
```

```jsx
<Generator
    defaultValue={ default_embed_data }
    onChange={ change_event }
/>
```

```jsx
<Visualizer
    bot={{ name: '', iconUrl: '' }} //optional
    embed={ discord_embed_object }
/>
```

---

## Examples
> A demo is available on the [github repo](https://github.com/artdude543/discord-embed-visualizer), just clone it, install packages `yarn install | npm install` and run the start script `yarn start | npm start`.

> Or if that's too much effort, you can just check out MRVDOG's [online demo](https://dev.mrv.dog/examples/discord-embed-visualizer).