import type { PayloadRequest } from "payload";
import type { AppCollectionSlug } from "@/types";

type Options = {
    collectionSlug: AppCollectionSlug
}
export const findPageByConfiguredCollection = async (req: PayloadRequest, {
    collectionSlug,
}: Options) => {
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