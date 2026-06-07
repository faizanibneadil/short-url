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
import { Sitemap } from "@/endpoints";
import { AfterChangeHook } from "./hooks/afterChangeHook";

export const Pages: CollectionConfig<'pages'> = {
    endpoints: [Sitemap],
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
    defaultPopulate: {
        meta: {
            ldSchema_references: true
        },
        slug: true,
        configuredCollectionSlug: true,
        enableCollection: true
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
                                            inlineBlocks: ['comicText', 'linkBadge', 'rotate_text']
                                        }),
                                    ]
                                },
                            }),
                            admin: {
                                condition: ({ enableCollection }) => Boolean(enableCollection) === false,
                            }
                        },
                        {
                            type: 'text',
                            name: 'configuredCollectionSlug',
                            admin: {
                                condition: ({ enableCollection }) => Boolean(enableCollection) === true,
                                components: {
                                    Field: {
                                        path: '@/components/ConfiguredCollectionSlug/index.tsx',
                                        exportName: 'ConfiguredCollectionSlug',
                                    }
                                },
                            },
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
                        }),
                        {
                            type: 'text',
                            name: 'keywords',
                            label: 'Keywords',
                            hasMany: true,
                            admin: {
                                description: 'The Web page keywords for search.'
                            }
                        },
                        {
                            type: 'relationship',
                            relationTo: ['structured_schemas'],
                            name: 'ldSchema_references',
                            label: 'JSON LD Schema References',
                            hasMany: true,
                        },
                        {
                            type: 'row',
                            fields: [{
                                type: 'checkbox',
                                name: 'index',
                                required: true,
                                defaultValue: true,
                                admin: {
                                    width: '50%',
                                    description: 'Enabling this allows Google and other search engines to show this page in search results.',
                                },
                            }, {
                                type: 'checkbox',
                                name: 'follow',
                                required: true,
                                defaultValue: true,
                                admin: {
                                    width: '50%',
                                    description: 'Enabling this tells search engines to follow the links present on this page to discover other pages.',
                                },
                            }]
                        },
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
                        },
                    ]
                },
            ]
        },
        slugField(),
        {
            type: 'checkbox',
            name: 'enableContainer',
            label: 'Enable Container',
            defaultValue: true,
            admin: {
                description: 'Enable Container of the page.',
                position: 'sidebar'
            }
        },
        {
            type: 'checkbox',
            name: 'enableCollection',
            label: 'Enable Collection',
            admin: {
                position: 'sidebar',
                description: 'If you want to show your collections like: Products, Categories etc then you have to change collection.',
            },
            required: true,
            defaultValue: false
        },
    ],
    hooks: {
        afterChange: [AfterChangeHook]
    }
}