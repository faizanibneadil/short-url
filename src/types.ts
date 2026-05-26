import type { CollectionSlug } from "payload"

export type Params = Promise<{
    collectionSlug: Extract<CollectionSlug, 'blogs'>,
    slug: string,
    url: string
}>

export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined
}>