import { BlocksFeature, HeadingFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig, slugField } from "payload";
import { combineWhereConstraints } from "payload/shared";
import {
    MetaDescriptionField,
    MetaImageField,
    MetaTitleField,
    OverviewField,
    PreviewField,
} from '@payloadcms/plugin-seo/fields'

export const Pages: CollectionConfig<'pages'> = {
    slug: 'pages',
    access: {
        create: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
        update: ({ req }) => Boolean(req.user),
        read: ({ req }) => true
    },
    labels: {
        plural: 'Pages',
        singular: 'Page'
    },
    admin: {
        useAsTitle: 'title'
    },
    fields: [
        {
            type: 'text',
            name: 'title',
            label: 'Title',
            required: true
        },
        {
            type: 'tabs',
            tabs: [
                {
                    label: 'Design',
                    admin: {
                        description: 'Use / command for get UI Blocks elements like: CTA, Hero, Newsletter etc.'
                    },
                    fields: [
                        {
                            type: 'richText',
                            name: 'content',
                            label: false,
                            editor: lexicalEditor({
                                features({ defaultFeatures, rootFeatures, }) {
                                    return [
                                        ...rootFeatures,
                                        BlocksFeature({
                                            blocks: ['urlShortener'],
                                            inlineBlocks: ['comicText', 'linkBadge']
                                        }),
                                    ]
                                },
                            })
                        }
                    ]
                },
                {
                    name: 'meta',
                    label: 'SEO',
                    admin: {
                        description: 'SEO your page here.'
                    },
                    fields: [
                        MetaTitleField({
                            // if the `generateTitle` function is configured
                            hasGenerateFn: true,
                        }),
                        MetaDescriptionField({
                            // if the `generateDescription` function is configured
                            hasGenerateFn: true,
                        }),
                        MetaImageField({
                            // the upload collection slug
                            relationTo: 'media',

                            // if the `generateImage` function is configured
                            hasGenerateFn: true,
                        }),
                        PreviewField({
                            // if the `generateUrl` function is configured
                            hasGenerateFn: true,

                            // field paths to match the target field for data
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                        }),
                        OverviewField({
                            // field paths to match the target field for data
                            titlePath: 'meta.title',
                            descriptionPath: 'meta.description',
                            imagePath: 'meta.image',
                        })
                    ]
                },
                {
                    name: 'settings',
                    label: 'Settings',
                    fields: [
                        {
                            type: 'row',
                            fields: [
                                {
                                    type: 'checkbox',
                                    name: 'enableHeader',
                                    label: 'Enable Header',
                                    defaultValue: true,
                                    admin: {
                                        description: 'Show or Hide header on the page'
                                    }
                                },
                                {
                                    type: 'checkbox',
                                    name: 'enableFooter',
                                    label: 'Enable Footer',
                                    defaultValue: true,
                                    admin: {
                                        description: 'Show or Hide Footer on the page'
                                    }
                                },
                                {
                                    type: 'checkbox',
                                    name: 'enableContainer',
                                    label: 'Enable Container',
                                    defaultValue: true,
                                    admin: {
                                        description: 'Enable Container of the page.'
                                    }
                                }
                            ]
                        }
                    ],
                    admin: {
                        description: 'Manage your page settings like paddings, margins etc.'
                    }
                }
            ]
        },
        slugField()
    ]
}