import { GlobalConfig } from "payload";

export const Footer: GlobalConfig<'footer'> = {
    slug: 'footer',
    fields: [{
        type: 'upload',
        relationTo: ['media'],
        name: 'logo'
    }, {
        type: 'textarea',
        name: 'slogan'
    }, {
        type: 'array',
        name: 'menus',
        fields: [{
            type: 'text',
            name: 'label'
        }, {
            type: 'array',
            name: 'links',
            fields: [{
                type: 'radio',
                name: 'type',
                defaultValue: 'internal',
                options: [{
                    label: 'External',
                    value: 'external'
                }, {
                    label: 'Internal',
                    value: 'internal'
                }]
            }, {
                type: 'row',
                fields: [{
                    type: 'text',
                    name: 'url',
                    admin: {
                        condition: (_, { type }) => type === 'external'
                    }
                }, {
                    type: 'relationship',
                    relationTo: ['pages'],
                    name: 'page',
                    admin: {
                        condition: (_, { type }) => type === 'internal'
                    }
                }, {
                    type: 'text',
                    name: 'label',
                }]
            }]
        }]
    }]
}