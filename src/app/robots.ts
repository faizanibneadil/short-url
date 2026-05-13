// app/robots.ts

import { getServerSideURL } from '@/utilities/getURL'
import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    const url = getServerSideURL()

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/admin/', '/api/'],
            },
        ],

        sitemap: `${url}/sitemap.xml`,
        host: url,
    }
}