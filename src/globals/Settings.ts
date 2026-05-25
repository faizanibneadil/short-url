import { GlobalConfig } from "payload";

export const Settings: GlobalConfig<'settings'> = {
    slug: 'settings',
    fields: [{
        type: 'text',
        name: 'brand_name'
    }, {
        type: 'text',
        name: 'slogan',
        label: 'Brand Slogan'
    }, {
        type: 'row',
        fields: [{
            type: 'upload',
            relationTo: ['media'],
            name: 'logo'
        }, {
            type: 'upload',
            name: 'favicon',
            relationTo: ['media']
        }, {
            type: 'upload',
            relationTo: 'media',
            name: 'og',
            label: 'Open Graph Image'
        },]
    }]
}