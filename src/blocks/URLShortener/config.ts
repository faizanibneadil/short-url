import { Block } from "payload";

export const URLShortener: Block = {
    slug: 'urlShortener',
    labels: {
        plural: 'URL Shorteners',
        singular: 'URL Shortener'
    },
    fields: [
        {
            type: 'text',
            name: 'heading',
            label: 'Heading'
        },
        {
            type: 'richText',
            name: 'description',
            label: 'Description'
        }
    ],
    interfaceName: 'TURLShortenerPropType'
}