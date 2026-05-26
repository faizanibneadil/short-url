import type { Page } from "@/payload-types"
import type { Params, SearchParams } from "@/types"
import { getServerSideURL } from "@/utilities/getURL"
import { queryCollectionByCollectionSlug } from "@/utilities/queries/queryCollectionByCollectionSlug"
import { queryPageByConfiguredCollection } from "@/utilities/queries/queryPageByConfiguiredCollection"
import type { Metadata } from "next"
import { notFound } from "next/navigation"
import type { CollectionSlug, PaginatedDocs } from "payload"


type CollectionMap = Record<Extract<CollectionSlug, 'blogs'>, {
    RenderCollection: React.ComponentType<{ collectionProps: PaginatedDocs<Extract<CollectionSlug, 'blogs'>> }>,
    metadata: (props: { doc: Page }) => Promise<Metadata>
}>
const _collectionMap: CollectionMap = {
    blogs: {
        RenderCollection: ({ collectionProps }) => {

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
                    canonical: new URL(`/pages/${doc.slug}`, __baseURL),
                },
                robots: {
                    index: true,
                    follow: true,
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

    const params = await props.params

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
    const params = await props.params

    if (!Object.keys(_collectionMap).includes(params.collectionSlug)) {
        return notFound()
    }

    const collection = await queryCollectionByCollectionSlug({
        collectionSlug: params.collectionSlug
    })

    const Collection = _collectionMap[params.collectionSlug].RenderCollection

    // @ts-expect-error
    return <Collection collectionProps={collection} />
}