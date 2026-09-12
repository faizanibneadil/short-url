import { Url } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { CollectionBeforeValidateHook } from "payload";

export const beforeValidateHook: CollectionBeforeValidateHook<Url> = ({
    data
}) => {
    const urlID = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    if (data && !data?.shortURL) {
        data.shortURL = urlID
    }
    if (data && !data?.shareable_url) {
        data.shareable_url = `${getServerSideURL()}/s/${urlID}`
    }

    return data
}