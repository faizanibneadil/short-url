import { Block } from "payload";

export const ComicText: Block = {
    slug: 'comicText',
    labels: {
        plural: 'Comic Texts',
        singular: 'Comic Text'
    },
    fields: [
        {
            type: 'text',
            name: 'content',
            label: 'Content'
        },
        {
            type: 'number',
            name: 'fontSize',
            label: 'Font Size',
            defaultValue: 4,
        }
    ],
    interfaceName: 'TComicTextPropsType',
}