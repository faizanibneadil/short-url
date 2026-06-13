import { generateSitemap } from "@/endpoints";
import { MetaDescriptionField, MetaImageField, MetaTitleField, OverviewField, PreviewField } from "@payloadcms/plugin-seo/fields";
import { lexicalEditor } from "@payloadcms/richtext-lexical";
import { CollectionConfig, slugField } from "payload";

export const Blogs: CollectionConfig<'blogs'> = {
    endpoints: [generateSitemap({
        collectionSlug: 'blogs'
    })],
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
        type: 'tabs',
        tabs: [
            {
                label: 'Block Content',
                fields: [
                    {
                        type: 'richText',
                        name: 'textContent',
                        editor: lexicalEditor({
                            features: ({ defaultFeatures, rootFeatures }) => {
                                return [...defaultFeatures, ...rootFeatures]
                            }
                        })
                    },
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
                            defaultValue: false,
                            admin: {
                                width: '50%',
                                description: 'Enabling this allows Google and other search engines to show this page in search results.',
                            },
                        }, {
                            type: 'checkbox',
                            name: 'follow',
                            required: true,
                            defaultValue: false,
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
                                        defaultValue: false,
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
    slugField()]
}