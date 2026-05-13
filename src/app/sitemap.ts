import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
import { getServerSideURL } from '@/utilities/getURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const __baseURL = getServerSideURL()
    const payload = await getPayload({ config })

    const pages = await payload.find({
        collection: 'pages',
        pagination: false,
        draft: false,
        select: {
            slug: true,
            updatedAt: true
        }
    })


    return pages?.docs.length === 0 ? [] : pages?.docs?.map(page => ({
        url: page?.slug === 'home' ? __baseURL : `${__baseURL}/pages/${page?.slug}`,
        priority: page?.slug === 'home' ? 1 : 0.8,
        changeFrequency: 'yearly',
        lastModified: page?.updatedAt,
    }))
}