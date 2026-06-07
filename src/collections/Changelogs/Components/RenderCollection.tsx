import { ChangeLog } from "@/components/ChangeLogs";
import { CollectionProps, Params, SearchParams } from "@/types";

export const RenderChangelogCollection: React.FC<{
    collectionProps: CollectionProps<'changelogs'>,
    params: Awaited<Params>,
    searchParams: Awaited<SearchParams>
}> = (props) => {
    const {
        collectionProps
    } = props || {}

    if (collectionProps?.docs?.length === 0) {
        return 'There is no changelogs available.'
    }

    const logs = collectionProps?.docs?.map(log => (
        <ChangeLog params={props.params} searchParams={props.searchParams} change={log} key={log.id} />
    ))

    return <div className="flex flex-col gap-4">
        {logs}
    </div>
}