import { formatCanonicalURL } from '@/utilities/formatCanonicalURL';
import { getServerSideURL } from '@/utilities/getURL';
import config from '@payload-config'
import { NextRequest } from 'next/server';
import { getPayload } from 'payload';
import { EnumChangefreq, ErrorLevel, SitemapItemLoose, SitemapStream, streamToPromise } from 'sitemap';

export async function GET(req: NextRequest) {
    const payload = await getPayload({ config })

    const sitemap: SitemapItemLoose[] = []

    const pages = await payload.find({
        collection: 'pages',
        pagination: false,
        draft: false,
        overrideAccess: true,
        req,
        trash: false,
    })

    for (const doc of (pages.docs ?? [])) {
        if (doc?.meta?.enableSitemap) {
            sitemap.push({
                url: formatCanonicalURL({ doc, collectionSlug: 'pages' }).toString(), // doc?.slug === 'home' ? __baseURL : new URL(`/pages/${doc?.slug}`, __baseURL).toString(),
                priority: doc?.meta.priority ?? undefined,
                changefreq: (doc?.meta.changeFrequency as EnumChangefreq) ?? undefined,
                lastmod: doc?.updatedAt,
            })
        }
    }

    /**
         * Generate the sitemap and return the response to the writer.
         */
    try {
        const stream = new SitemapStream({
            errorHandler: (error: Error, level: ErrorLevel) => {
                payload.logger.error(`Error generating sitemap:  ${error}, level: ${level}`);
            },
            hostname: payload.config.serverURL,
            xmlns: {
                image: false,
                news: false,
                video: false,
                xhtml: true,
            }
        });
        sitemap.forEach((item) => stream.write(item));
        stream.end();

        const xmlData = await streamToPromise(stream);

        return new Response(xmlData.toString(), {
            headers: {
                'Content-Type': 'application/xml',
                // 'Cache-Control': 'public, max-age=3600, s-maxage=3600',  // 1 hour cache
            },
        });
    } catch (error) {
        // @ts-expect-error
        req.payload.logger.error('Sitemap generation failed', error);
        return new Response('Error generating sitemap', { status: 500 });
    }

}