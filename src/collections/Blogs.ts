import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Blogs: CollectionConfig<'blogs'> = {
    slug: 'blogs',
    admin: {
        useAsTitle: 'title',
        custom: {
            enableCollectionView: true
        }
    },
    fields: [{
        type: 'text',
        name: 'title',
        required: true,
    }, {
        type: 'richText',
        name: 'textContent',
        editor: lexicalEditor({
            features: ({ defaultFeatures, rootFeatures }) => {
                return [...defaultFeatures, ...rootFeatures]
            }
        })
    }]
}