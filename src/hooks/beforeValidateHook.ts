import { Url } from "@/payload-types";
import { CollectionBeforeValidateHook } from "payload";

export const beforeValidateHook: CollectionBeforeValidateHook<Url> = ({
    data
}) => {
    if (data && !data?.shortURL) {
        data.shortURL = `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`
    }

    return data
}