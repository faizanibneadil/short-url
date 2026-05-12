import { CollectionSlug } from "payload"

export type Params = Promise<{
    collectionSlug: CollectionSlug,
    slug: string
}>

export type SearchParams = Promise<{
    [key: string]: string | string[] | undefined
}>