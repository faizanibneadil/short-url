import { CollectionSlug, getPayload } from "payload";
import config from '@payload-config'
import { cacheLife, cacheTag } from "next/cache";
import { AppCollectionSlug } from "@/types";

export const queryCollectionByCollectionSlug = async ({
    collectionSlug
}: {
    collectionSlug: AppCollectionSlug
}) => {
    const payload = await getPayload({ config })
    const collection = await payload.find({
        collection: collectionSlug,
        draft: false,
        pagination: true,
    })

    return collection
}