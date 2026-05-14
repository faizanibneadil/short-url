import config from '@payload-config'
import { RichText } from "@/components/RitchText";
import { CollectionSlug, getPayload } from "payload";
import { Params, SearchParams } from '@/types';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { getServerSideURL } from '@/utilities/getURL';

export async function generateMetadata(props: {
    params: Params,
    searchParams: SearchParams
}): Promise<Metadata> {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    const page = await queryPageBySlug({
        slug: params.slug
    })

    if (!page) {
        return {
            title: '404 - Page Not Found',
            description: '404 - Page Not Found'
        }
    }

    const __home = page.slug === 'home'
    const __baseURL = getServerSideURL()

    return {
        title: page?.meta?.title,
        description: page?.meta?.description,
        openGraph: {
            title: page?.meta?.title || '',
            description: page?.meta?.description || '',
            url: "https://short.devslix.com",
            siteName: "Short by DevSlix",
            type: "website",
        },
        metadataBase: new URL(__baseURL),
        alternates: {
            canonical: __home ? __baseURL : new URL(`/pages/${page.slug}`, __baseURL),
        },
        robots: {
            index: true,
            follow: true,
        },
        twitter: {
            card: 'summary_large_image',
            title: page?.meta?.title || '',
            description: page?.meta?.description || '',
        },
    }

}

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])
    const page = await queryPageBySlug({
        slug: params.slug
    })

    const schema = {
        "@context": "https://schema.org",
        "@type": "SoftwareApplication",
        name: "DevSlix URL Shortener",
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: "https://short.devslix.com",
        description:
            "Free URL shortener to create short links, custom URLs, and track analytics.",
        offers: {
            "@type": "Offer",
            price: "0",
            priceCurrency: "USD",
        },
        creator: {
            "@type": "Organization",
            name: "DevSlix",
        },
    };
    const organizationSchema = {
        "@context": "https://schema.org",
        "@type": "Organization",
        name: "DevSlix",
        url: "https://devslix.com",
        logo: "https://short.devslix.com/logo.png",
        // sameAs: [
        //     "https://twitter.com/yourusername",
        //     "https://github.com/yourusername",
        //     "https://linkedin.com/in/yourusername",
        // ],
    };

    const websiteSchema = {
        "@context": "https://schema.org",
        "@type": "WebSite",
        name: "DevSlix URL Shortener",
        url: "https://short.devslix.com",
        // potentialAction: {
        //     "@type": "SearchAction",
        //     target:
        //         "https://short.devslix.com/search?q={search_term_string}",
        //     "query-input": "required name=search_term_string",
        // },
    };

    const faqSchema = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        mainEntity: [
            {
                "@type": "Question",
                name: "What is DevSlix URL Shortener?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "DevSlix is a free URL shortener that helps users create short and trackable links.",
                },
            },
            {
                "@type": "Question",
                name: "Can I create custom short URLs?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, DevSlix allows users to create custom branded short links.",
                },
            },
            {
                "@type": "Question",
                name: "Does DevSlix provide analytics?",
                acceptedAnswer: {
                    "@type": "Answer",
                    text: "Yes, you can track clicks and link performance using built-in analytics.",
                },
            },
        ],
    };

    return <div className={cn({
        "prose md:prose-md dark:prose-invert font-(family-name:--font-outfit) w-full p-4": true,
        "max-w-2xl mx-auto": page?.settings?.enableContainer
    })}>
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(schema),
            }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(organizationSchema),
            }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(websiteSchema),
            }}
        />
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify(faqSchema),
            }}
        />
        <RichText
            data={page?.content as DefaultTypedEditorState}
            params={params}
            searchParams={searchParams}
            blocks={{
                urlShortener: ({ node }) => {
                    const URLShortener = dynamic(() => import('@/blocks/URLShortener/component').then(({ URLShortener }) => ({
                        default: URLShortener
                    })))
                    return <URLShortener blockProps={node.fields} params={params} searchParams={searchParams} />
                }
            }}
            inlineBlocks={{
                comicText: ({ node }) => <div>Comic Text</div>,
                linkBadge: ({ node }) => <div>Link Badge</div>
            }}
        />
    </div>
}

const queryPageBySlug = async ({
    slug
}: {
    slug: string
}) => {
    const payload = await getPayload({ config })
    const page = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug
            }
        }
    })

    return page?.docs?.at(0)
}