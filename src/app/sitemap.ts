import type { MetadataRoute } from 'next'
import config from '@payload-config'
import { getPayload } from 'payload'
// import { getServerSideURL } from '@/utilities/getURL'
import { formatCanonicalURL } from '@/utilities/formatCanonicalURL'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    // const __baseURL = getServerSideURL()
    const payload = await getPayload({ config })

    const pages = await payload.find({
        collection: 'pages',
        pagination: false,
        draft: false,
        // select: {
        //     meta: {
        //         enableSitemap: true
        //     },
        //     enableCollection: true,
        //     slug: true,
        //     updatedAt: true
        // }
    })

    const sitemap: MetadataRoute.Sitemap = []

    for (const doc of (pages.docs ?? [])) {
        if (doc?.meta?.enableSitemap) {
            sitemap.push({
                url: formatCanonicalURL(doc).toString(), // doc?.slug === 'home' ? __baseURL : new URL(`/pages/${doc?.slug}`, __baseURL).toString(),
                priority: doc?.meta.priority ?? undefined,
                changeFrequency: doc?.meta.changeFrequency ?? undefined,
                lastModified: doc?.updatedAt,
            })
        }
    }


    return sitemap
}