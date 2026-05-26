import config from '@payload-config'
import { getPayload } from 'payload'

export const queryPageBySlug = async ({ slug }: { slug: string }) => {
    const payload = await getPayload({
        config,
        onInit: (payload) => {
            console.log('init from queryPageSlug')
        },
    })

    const page = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug
            }
        },
        draft: false,
        limit: 1
    })

    return page.docs.at(0)
}