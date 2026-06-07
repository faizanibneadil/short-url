import { Page } from '@/payload-types'
import config from '@payload-config'
import { cacheLife, cacheTag } from 'next/cache'
import { PaginatedDocs } from 'payload'
import { PayloadRequest, getPayload } from 'payload'

export const queryPageBySlug = async ({ slug, req }: { slug: string, req?: PayloadRequest }) => {
    const payload = req ? req?.payload : await getPayload({ config })

    if (await payload.kv.has(slug)) {
        payload.logger.info('quering from redis')
        return await payload.kv.get<Page>(slug)
    } else {
        payload.logger.info('quering from db')
        const page = await payload.find({
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
}