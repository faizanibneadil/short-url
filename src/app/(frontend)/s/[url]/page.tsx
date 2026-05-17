import type { Params, SearchParams } from '@/types'
import config from '@payload-config'
import { redirect } from 'next/navigation'
import { getPayload } from 'payload'

export default async function Page(props: {
    params: Params & { url: string },
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])
    const payload = await getPayload({ config })
    const url = await payload.find({
        collection: 'urls',
        where: {
            shortURL: {
                equals: params.url
            }
        }
    })

    const urlToUse = url.docs.at(0)

    if (!url || url?.docs?.length === 0 || !urlToUse?.shortURL) {
        return 'Invalid URL'
    }

    if (url && urlToUse?.longURL) {
        redirect(urlToUse?.longURL)
    }

    return null
}