import type { CollectionConfig } from 'payload'
import { beforeValidateHook } from '@/hooks/beforeValidateHook'

export const URLs: CollectionConfig<'urls'> = {
    slug: 'urls',

    labels: {
        plural: 'URLs',
        singular: 'URL',
    },

    admin: {
        useAsTitle: 'shortURL',
        defaultColumns: ['shortURL', 'longURL', 'clicks', 'createdAt'],
    },

    access: {
        create: () => true,
        read: () => true,
        update: ({ req }) => Boolean(req.user),
        delete: ({ req }) => Boolean(req.user),
    },

    fields: [
        {
            type: 'text',
            name: 'longURL',
            label: 'Long URL',
            required: true,

            validate: (value: string | null | undefined) => {
                try {
                    if (!value) {
                        return 'URL is required.'
                    }

                    const parsedURL = new URL(value)

                    // only allow http/https
                    if (
                        parsedURL.protocol !== 'http:' &&
                        parsedURL.protocol !== 'https:'
                    ) {
                        return 'Only HTTP and HTTPS URLs are allowed.'
                    }

                    return true
                } catch (error) {
                    return 'Please enter a valid URL.'
                }
            },
        },

        {
            type: 'text',
            name: 'shortURL',
            label: 'Short URL',
            required: true,
            unique: true,
            index: true,

            admin: {
                description: 'Auto generated short slug',
            },

            validate: (value: string | null | undefined) => {
                if (!value) {
                    return 'Short URL is required.'
                }

                const regex = /^[a-zA-Z0-9_-]+$/

                if (!regex.test(value)) {
                    return 'Only letters, numbers, hyphens and underscores are allowed.'
                }

                if (value.length < 4) {
                    return 'Short URL must be at least 4 characters.'
                }

                return true
            },
        },
    ],

    hooks: {
        beforeValidate: [beforeValidateHook],
    },

    timestamps: true,
}