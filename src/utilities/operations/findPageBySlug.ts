import type { PayloadRequest } from 'payload'

type Options = { slug: string }
export const findPageBySlug = async (req: PayloadRequest, { slug }: Options) => {

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