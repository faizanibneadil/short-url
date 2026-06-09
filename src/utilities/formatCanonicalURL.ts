import { Page } from "@/payload-types";
import { getServerSideURL } from "./getURL";

export const formatCanonicalURL = (page: Page) => {
    const __baseURL = getServerSideURL()

    let url: URL | undefined

    if (page?.enableCollection) {
        url = new URL(`/${page?.configuredCollectionSlug}`, __baseURL)
    } else {
        url = new URL(`/pages/${page.slug}`, __baseURL)
    }

    return url
}