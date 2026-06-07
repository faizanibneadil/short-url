import type { PayloadRequest } from 'payload'

export const findPageBySlug = async ({ slug, req }: { slug: string, req: PayloadRequest }) => {

    const page = await req.payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug
            }
        },
        draft: false,
        limit: 1,
        req
    })

    return page.docs.at(0)

}