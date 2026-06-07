import type { Page } from "@/payload-types";
import type { AppCollectionSlug } from "@/types";
import { findPageByConfiguredCollection } from "@/utilities/operations/findPageByConfiguredCollection";
import { findPageBySlug } from "@/utilities/operations/findPageBySlug";
import type { CollectionAfterChangeHook } from "payload";

export const AfterChangeHook: CollectionAfterChangeHook<Page> = async ({ doc, req }) => {

    try {
        if (doc?.id && doc?.slug) {
            const queryKey = doc?.enableCollection && doc?.configuredCollectionSlug
                ? doc?.configuredCollectionSlug
                : doc?.slug

            if (doc?.enableCollection && doc?.configuredCollectionSlug) {
                const page = await findPageByConfiguredCollection({ req, collectionSlug: doc?.configuredCollectionSlug as AppCollectionSlug })
                await req.payload.kv.has(queryKey) && await req.payload.kv.delete(queryKey)
                page && req.payload.logger.info(`[CACHE HIT]: QueryKey is (${queryKey})`)
                page && req.payload.kv.set(queryKey, page)
            } else {
                const page = await findPageBySlug({ req, slug: doc?.slug })
                await req.payload.kv.has(queryKey) && await req.payload.kv.delete(queryKey)
                page && req.payload.logger.info(`[CACHE HIT]: QueryKey is (${queryKey})`)
                page && req.payload.kv.set(queryKey, page)
            }
        } else {
            req.payload.logger.error('[CACHE MISS] Document ID or SLUG is missing.')
        }

        return doc
    } catch (error) {
        req.payload.logger.error(error)
        return doc
    }
}