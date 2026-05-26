import { Footer } from "@/payload-types"

export function formatHref(item: NonNullable<NonNullable<Footer['menus']>[number]['links']>[number]) {
    let url: string = ''

    if (item?.type === 'external' && item?.url) {
        url = item?.url
    }

    if (item?.type === 'internal' && typeof item?.page?.value === 'object') {
        // if (item?.page?.value?.enableCollection) {
        // 	url = `/${item?.page?.value?.configuredCollectionSlug}`
        // } else {
        // 	url = `/${item?.page?.relationTo}/${item?.page?.value?.slug}`
        // }
        url = `/${item?.page?.relationTo}/${item?.page?.value?.slug}`
    }

    return url
}