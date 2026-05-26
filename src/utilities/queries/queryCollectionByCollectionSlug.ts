import { CollectionSlug, getPayload } from "payload";
import config from '@payload-config'

export const queryCollectionByCollectionSlug = async ({
    collectionSlug
}: {
    collectionSlug: Extract<CollectionSlug, 'blogs'>
}) => {
    const payload = await getPayload({ config })
    const collection = await payload.find({
        collection: collectionSlug,
        draft: false,
        pagination: true,
    })

    return collection
}