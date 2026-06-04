import { AppCollectionSlug } from "@/types";
import { formatCanonicalURL } from "@/utilities/formatCanonicalURL";
import { MetadataRoute } from "next";
import { Endpoint } from "payload";
import { EnumChangefreq, ErrorLevel, SitemapItemLoose, SitemapStream, streamToPromise } from 'sitemap';

export const Sitemap: Endpoint = {
    handler: async (req) => {
        // const collectionSlug = req?.routeParams?.collectionSlug as AppCollectionSlug
        // console.log(collectionSlug, "collectionSlug")
        const sitemap: SitemapItemLoose[] = []

        const pages = await req.payload.find({
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
                    url: formatCanonicalURL(doc).toString(), // doc?.slug === 'home' ? __baseURL : new URL(`/pages/${doc?.slug}`, __baseURL).toString(),
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
                    req.payload.logger.error(`Error generating sitemap:  ${error}, level: ${level}`);
                },
                hostname: req.payload.config.serverURL,
            });
            sitemap.forEach((item) => stream.write(item));
            stream.end();

            const xmlData = await streamToPromise(stream);

            return new Response(xmlData.toString(), {
                headers: { 'Content-Type': 'application/xml' },
            });
        } catch (error) {
            // @ts-expect-error
            req.payload.logger.error('Sitemap generation failed', error);
            return new Response('Error generating sitemap', { status: 500 });
        }
    },
    path: '/sitemap.xml',
    method: 'get'
}