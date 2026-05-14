// app/robots.ts

import { getServerSideURL } from '@/utilities/getURL'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const __baseURL = getServerSideURL()

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],

        sitemap: `${__baseURL}/sitemap.xml`,
        host: __baseURL,
    }
}