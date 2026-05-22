import { Url } from "@/payload-types";
import { getServerSideURL } from "@/utilities/getURL";
import { CollectionBeforeValidateHook } from "payload";

export const beforeValidateHook: CollectionBeforeValidateHook<Url> = ({
    data
}) => {
    const URL_ID = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    if (data && !data?.shortURL) {
        data.shortURL = URL_ID
    }
    if (data && !data?.shareable_url) {
        data.shareable_url = `${getServerSideURL()}/s/${URL_ID}`
    }

    return data
}