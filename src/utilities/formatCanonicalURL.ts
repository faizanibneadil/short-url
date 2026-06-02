import { Page } from "@/payload-types";
import { getServerSideURL } from "./getURL";

export const formatCanonicalURL = (page: Page) => {
    const __baseURL = getServerSideURL()

    let url: URL | undefined

    if (page?.slug === 'home' && page?.enableCollection) {
        url = new URL(__baseURL)
    } else if (page?.slug === 'home') {
        url = new URL(__baseURL)
    } else if (page?.enableCollection) {
        url = new URL(`/${page?.configuredCollectionSlug}`, __baseURL)
    } else {
        url = new URL(`/pages/${page.slug}`, __baseURL)
    }

    return url
}