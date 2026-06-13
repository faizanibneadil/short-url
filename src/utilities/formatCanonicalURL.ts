import { Page } from "@/payload-types";
import { getServerSideURL } from "./getURL";
import { DataFromCollectionSlug } from "payload";
import { AppCollectionSlug } from "@/types";

export const formatCanonicalURL = ({
    collectionSlug,
    doc
}: {
    doc: DataFromCollectionSlug<AppCollectionSlug>,
    collectionSlug: AppCollectionSlug
}) => {
    const __baseURL = getServerSideURL()

    let url: URL | undefined

    if (collectionSlug === 'pages') {
        const _page = doc as DataFromCollectionSlug<'pages'>
        if (_page?.enableCollection) {
            url = new URL(`/${_page?.configuredCollectionSlug}`, __baseURL)
        } else {
            url = new URL(`/pages/${doc.slug}`, __baseURL)
        }
    } else {
        url = new URL(`/${collectionSlug}/${doc?.slug}`, __baseURL)
    }

    return url
}