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
                            overrides: {

                            },
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
                        }),
                        {
                            type: 'group',
                            fields: [
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            type: 'checkbox',
                                            name: 'enableSitemap',
                                            label: 'Enable Sitemap',
                                            defaultValue: true,
                                            required: true,
                                            admin: {
                                                description: 'Enable Sitemap of the page.'
                                            }
                                        },
                                    ]
                                },
                                {
                                    type: 'row',
                                    fields: [
                                        {
                                            type: 'select',
                                            name: 'changeFrequency',
                                            label: 'Change Frequency',
                                            required: true,
                                            defaultValue: "yearly",
                                            options: ["yearly", "always", "hourly", "daily", "weekly", "monthly", "never"].map(o => ({
                                                label: o.at(0)?.toLowerCase() + o.slice(1),
                                                value: o
                                            })),
                                            admin: {
                                                condition: (_, { enableSitemap }) => enableSitemap
                                            }
                                        },
                                        {
                                            type: 'number',
                                            name: 'priority',
                                            label: 'Priority',
                                            required: true,
                                            defaultValue: 1,
                                            min: 0,
                                            max: 1,
                                            admin: {
                                                step: 0.1,
                                                condition: (_, { enableSitemap }) => enableSitemap
                                            }
                                        }
                                    ]
                                }
                            ]
                        }
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
                                },
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