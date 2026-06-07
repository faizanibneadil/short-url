import type { PayloadRequest } from "payload";
import type { AppCollectionSlug } from "@/types";

export const findPageByConfiguredCollection = async ({
    collectionSlug,
    req
}: {
    collectionSlug: AppCollectionSlug,
    req: PayloadRequest
}) => {
    const page = await req.payload.find({
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