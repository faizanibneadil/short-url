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
            settings: {
                enableSitemap: true,
            },
            slug: true,
            updatedAt: true
        }
    })

    const sitemap: MetadataRoute.Sitemap = []

    for (const { slug, updatedAt, settings } of (pages.docs ?? [])) {
        if (settings?.enableSitemap) {
            sitemap.push({
                url: slug === 'home' ? __baseURL : new URL(`/pages/${slug}`, __baseURL).toString(),
                priority: slug === 'home' ? 1 : 0.8,
                changeFrequency: 'yearly',
                lastModified: updatedAt,
            })
        }
    }


    return sitemap
}