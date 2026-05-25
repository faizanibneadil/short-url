import { GlobalConfig } from "payload";

export const Header: GlobalConfig<'header'> = {
    slug: 'header',
    fields: [{
        type: 'upload',
        relationTo: 'media',
        name: 'logo'
    }]
}