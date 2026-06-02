import { Changelog } from "@/payload-types";

export const ChangeLog: React.FC<{ change: Changelog }> = ({
    change
}) => {
    return change.title
}