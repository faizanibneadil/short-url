import { AppCollectionSlug } from "@/types";
import { BasePayload } from "payload";
import { findPageByConfiguredCollection } from "./findPageByConfiguredCollection";
import { findPageBySlug } from "./findPageBySlug";

export const InitializePagesCache = async ({ payload }: { payload: BasePayload }) => {
    try {
        const pages = await payload.find({
            collection: 'pages',
            pagination: false,
            draft: false,
            depth: 2,
        })

        for (const page of (pages?.docs ?? [])) {
            if (page && page?.id && page?.slug) {
                const queryKey = page?.enableCollection && page?.configuredCollectionSlug
                    ? page?.configuredCollectionSlug
                    : page?.slug

                if (page?.enableCollection && page?.configuredCollectionSlug) {
                    await payload.kv.has(queryKey) && await payload.kv.delete(queryKey)
                    page && payload.logger.info(`[CACHE HIT]: QueryKey is (${queryKey})`)
                    page && payload.kv.set(queryKey, page)
                } else {
                    await payload.kv.has(queryKey) && await payload.kv.delete(queryKey)
                    page && payload.logger.info(`[CACHE HIT]: QueryKey is (${queryKey})`)
                    page && payload.kv.set(queryKey, page)
                }
            } else {
                payload.logger.error('[CACHE MISS] Document ID or SLUG is missing.')
            }
        }
    } catch (error) {
        payload.logger.error({ error }, 'Something going wrong when initializing pages cache')
    }
}