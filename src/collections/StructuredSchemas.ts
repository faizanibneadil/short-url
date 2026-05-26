import { CollectionConfig } from "payload";

export const StructuredSchemas: CollectionConfig<'structured_schemas'> = {
    slug: 'structured_schemas',
    labels: {
        plural: 'ld+json Schemas',
        singular: 'ld+json Schema'
    },
    admin: { useAsTitle: 'title' },
    fields: [{
        type: 'text',
        name: 'title',
        required: true,
    }, {
        type: 'json',
        name: 'ld_schema',
        required: true,
        admin: {
            description: 'Do not use like this {"@Context":"https://schema.org"} make reuseable schemas just like a plan object'
        },
    }]
}