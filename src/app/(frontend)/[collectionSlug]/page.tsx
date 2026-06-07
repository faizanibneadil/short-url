import type { StructuredSchema } from "@/payload-types"
import type { CollectionMapType, Params, SearchParams } from "@/types"
import { formatCanonicalURL } from "@/utilities/formatCanonicalURL"
import { getServerSideURL } from "@/utilities/getURL"
import { queryCollectionByCollectionSlug } from "@/utilities/queries/queryCollectionByCollectionSlug"
import { queryPageByConfiguredCollection } from "@/utilities/queries/queryPageByConfiguiredCollection"
import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { notFound } from "next/navigation"


const _collectionMap: CollectionMapType = {
    changelogs: {
        metadata: async ({ doc }) => {
            const __baseURL = getServerSideURL()
            return {
                title: doc?.meta?.title,
                description: doc?.meta?.description,
                keywords: doc?.meta?.keywords,
                openGraph: {
                    title: doc?.meta?.title || '',
                    description: doc?.meta?.description || '',
                    url: "https://short.devslix.com",
                    siteName: "Short by DevSlix",
                    type: "website",
                },
                metadataBase: new URL(__baseURL),
                authors: {
                    name: 'DevSlix',
                    url: 'https://devslix.com'
                },
                alternates: {
                    canonical: formatCanonicalURL(doc),
                },
                robots: {
                    index: doc?.meta?.index,
                    follow: doc?.meta?.follow,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: doc?.meta?.title || '',
                    description: doc?.meta?.description || '',
                },
            }
        },
        component: dynamic(() => import('@/collections/Changelogs/Components/RenderCollection').then(({ RenderChangelogCollection }) => ({
            default: RenderChangelogCollection
        })))
    },
    blogs: {
        component: ({ collectionProps }) => {

            if (collectionProps.docs.length === 0) {
                return 'Blogs Not Found.'
            }

            return 'blogs'
        },
        metadata: async ({ doc }) => {
            const __baseURL = getServerSideURL()
            return {
                title: doc?.meta?.title,
                description: doc?.meta?.description,
                keywords: doc?.meta?.keywords,
                openGraph: {
                    title: doc?.meta?.title || '',
                    description: doc?.meta?.description || '',
                    url: "https://short.devslix.com",
                    siteName: "Short by DevSlix",
                    type: "website",
                },
                metadataBase: new URL(__baseURL),
                authors: {
                    name: 'DevSlix',
                    url: 'https://devslix.com'
                },
                alternates: {
                    canonical: formatCanonicalURL(doc),
                },
                robots: {
                    index: doc?.meta?.index,
                    follow: doc?.meta?.follow,
                },
                twitter: {
                    card: 'summary_large_image',
                    title: doc?.meta?.title || '',
                    description: doc?.meta?.description || '',
                },
            }
        }
    }
}

export const generateMetadata = async (props: {
    params: Params,
    searchParams: SearchParams
}): Promise<Metadata> => {

    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    if (!Object.keys(_collectionMap).includes(params.collectionSlug)) {
        return {
            title: '404 - Not Found.',
            description: 'Page Not Found.'
        }
    }

    const page = await queryPageByConfiguredCollection({
        collectionSlug: params.collectionSlug
    })

    if (params.collectionSlug in _collectionMap) {
        const metadata = _collectionMap[params.collectionSlug].metadata

        if (typeof metadata === 'function') {
            return await metadata({ doc: page! })
        }

        return {}
    }

    return {}
}

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    if (!Object.keys(_collectionMap).includes(params.collectionSlug)) {
        return notFound()
    }

    const page = await queryPageByConfiguredCollection({
        collectionSlug: params.collectionSlug
    })

    const collection = await queryCollectionByCollectionSlug({
        collectionSlug: params.collectionSlug
    })

    const Collection = _collectionMap[params.collectionSlug].component

    return (
        <>
            {Boolean(page?.meta?.ldSchema_references?.length) && (<script
                type="application/ld+json"
                dangerouslySetInnerHTML={{
                    __html: JSON.stringify({
                        "@context": "https://schema.org",
                        "@graph": [
                            ...(page?.meta?.ldSchema_references?.map(schema => {
                                return (schema.value as StructuredSchema).ld_schema
                            }) ?? []).filter(Boolean)
                        ]
                    }),
                }}
            />)}
            {/* @ts-expect-error */}
            <Collection params={params} searchParams={searchParams} collectionProps={collection} />
        </>
    )
}
