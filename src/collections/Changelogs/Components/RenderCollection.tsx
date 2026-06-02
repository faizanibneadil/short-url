import { ChangeLog } from "@/components/ChangeLogs";
import { CollectionProps } from "@/types";

export const RenderChangelogCollection: React.FC<{ collectionProps: CollectionProps<'changelogs'> }> = (props) => {
    const {
        collectionProps
    } = props || {}

    if (collectionProps?.docs?.length === 0) {
        return 'There is no changelogs available.'
    }

    const logs = collectionProps?.docs?.map(log => (
        <ChangeLog change={log} key={log.id} />
    ))

    return logs
}