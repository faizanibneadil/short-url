import { CollectionSlug, getPayload } from "payload";
import config from "@payload-config";

export const queryPageByConfiguredCollection = async ({ collectionSlug }: { collectionSlug: Extract<CollectionSlug, 'blogs' | 'changelogs'> }) => {
    const payload = await getPayload({ config })
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
    })

    return page?.docs?.at(0)
}