import { Config } from '@/payload-types'
import config from '@payload-config'
import { cacheTag } from 'next/cache'
import { getPayload } from 'payload'

export const queryGlobals = async ({ slug, depth = 2 }: { slug: keyof Config['globals'], depth?: number }) => {
    const payload = await getPayload({
        config,
        onInit: payload => {
            console.log('Init from Query Globals', slug)
        }
    })

    const global = await payload.findGlobal({
        slug,
        draft: false,
        depth
    })

    return global
}