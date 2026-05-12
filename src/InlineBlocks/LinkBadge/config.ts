import { Block } from "payload";

export const LinkBadge: Block = {
    slug: 'linkBadge',
    labels: {
        plural: 'Links Badges',
        singular: 'Link Badge'
    },
    fields: [
        {
            type: 'radio',
            name: 'type',
            label: 'Link Type',
            defaultValue: 'internal',
            options: [
                { label: 'internal', value: 'Internal' },
                { label: 'external', value: 'External' },
            ]
        },
        {
            type: 'relationship',
            relationTo: ['pages'],
            name: 'page',
            admin: {
                condition: (_, { type }) => type === 'internal'
            }
        },
        {
            type: 'text',
            name: 'url',
            label: 'URL',
            admin: {
                condition: (_, { type }) => type === 'external'
            }
        }
    ],
    interfaceName: 'TLinkBadgePropType'
}