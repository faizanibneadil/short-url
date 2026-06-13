import type { CollectionSlug, DataFromCollectionSlug, PaginatedDocs } from "payload"
import { Page } from "./payload-types"
import { Metadata } from "next"

export type AppCollectionSlug = Extract<CollectionSlug, 'blogs' | 'changelogs' | 'pages'>

export type Params = Promise<{
    collectionSlug: AppCollectionSlug,
    slug: string,
    url: string
}>

export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined
}>

export type CollectionProps<K extends AppCollectionSlug> = PaginatedDocs<DataFromCollectionSlug<K>>
export type CollectionMapType = {
    [K in AppCollectionSlug]?: {
        component: React.ComponentType<{
            collectionProps: CollectionProps<K>
            params: Awaited<Params>,
            searchParams: Awaited<SearchParams>
        }>,
        metadata: (args: { doc: Page, params: Awaited<Params>, searchParams: Awaited<SearchParams> }) => Metadata | Promise<Metadata>,
    }
}