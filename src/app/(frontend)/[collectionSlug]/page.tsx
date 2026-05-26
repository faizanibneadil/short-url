import type { Params, SearchParams } from "@/types"

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const params = await props.params
    return params.collectionSlug
}