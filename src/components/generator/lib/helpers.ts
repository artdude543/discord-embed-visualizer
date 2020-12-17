// @ts-nocheck
import { IEmbed } from '../';

export type ExporterType = 'discordjs';

export const generateExport = (exporter: ExporterType, data: IEmbed) => {
    switch (exporter) {
        case 'discordjs':
        default:
            return {
                title: data.body?.title,
                type: 'rich',
                description: data.body?.description,
                url: data.body?.url,
                timestamp: new Date(data.footer.timestamp).toISOString(),
                color: Number(`0x${data.color.charAt(0) === '#' ? data.color.slice(1) : data.color}`),
                footer: {
                    text: data.footer?.text,
                    icon_url: data.footer?.iconUrl,
                },
                image: {
                    url: data.image?.url,
                    height: data.image?.height > 0 ? data.image?.height : undefined,
                    width: data.image?.height > 0 ? data.image?.width : undefined,
                },
                thumbnail: {
                    url: data.image?.url,
                    height: data.image?.height > 0 ? data.image?.height : undefined,
                    width: data.image?.height > 0 ? data.image?.width : undefined,
                },
                author: {
                    name: data.author?.name,
                    url: data.author?.url,
                    icon_url: data.author?.iconUrl,
                },
                fields: data.fields,
            };
    }
}

export const copyToClipBoard = async function (str: string, callback?: () => void) {
    return navigator.permissions.query({ name: 'clipboard-write' })
        .then(async res => {
            if (res.state === 'granted' || res.state === 'prompt') {
                return navigator.clipboard.writeText(str)
                    .then(() => callback())
                    .catch(err => console.error('Failed to write to clipboard', err));
            }
        });
}