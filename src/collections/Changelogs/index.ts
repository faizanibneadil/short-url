import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig } from "payload";

export const Changelogs: CollectionConfig<'changelogs'> = {
    slug: 'changelogs',
    admin: {
        useAsTitle: 'title',
        custom: {
            enableCollectionView: true
        }
    },
    fields: [
        {
            type: 'text',
            name: 'title',
            required: true,
        },
        {
            type: 'richText',
            name: 'changes',
            required: true,
            editor: lexicalEditor({
                features: ({ defaultFeatures, rootFeatures }) => {
                    return [...defaultFeatures, ...rootFeatures]
                }
            })
        }
    ]
}