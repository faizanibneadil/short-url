import { BasePayload, CollectionSlug, PayloadRequest, getPayload } from "payload";
import config from "@payload-config";
import { cacheLife, cacheTag } from "next/cache";
import { AppCollectionSlug } from "@/types";

export const queryPageByConfiguredCollection = async ({ collectionSlug, req }: { collectionSlug: AppCollectionSlug, req?: PayloadRequest }) => {
    const payload = req ? req?.payload : await getPayload({ config })
    const page = await payload.find({
        collection: 'pages',
        draft: false,
        limit: 1,
        pagination: false,
        depth: 2,
        where: {
            configuredCollectionSlug: {
                equals: collectionSlug
            }
        },
        req
    })

    return page?.docs?.at(0)
}