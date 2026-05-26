import { Config } from '@/payload-types'
import config from '@payload-config'
import { getPayload } from 'payload'

export const queryGlobals = async ({ slug }: { slug: keyof Config['globals'] }) => {
    const payload = await getPayload({
        config,
        onInit: payload => {
            console.log('Init from Query Globals', slug)
        }
    })

    const global = await payload.findGlobal({
        slug,
        draft: false,
    })

    return global
}