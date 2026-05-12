import config from '@payload-config'
import { RichText } from "@/components/RitchText";
import { CollectionSlug, getPayload } from "payload";
import { Params, SearchParams } from '@/types';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])
    const page = await queryPageBySlug({
        slug: params.slug
    })
    return <div className={cn({
        "prose md:prose-md dark:prose-invert font-(family-name:--font-outfit)": true,
        "max-w-2xl mx-auto": page?.settings?.enableContainer
    })}>
        <RichText
            data={page?.content as DefaultTypedEditorState}
            params={params}
            searchParams={searchParams}
            blocks={{
                urlShortener: ({ node }) => <div>URL Shortener</div>
            }}
            inlineBlocks={{
                comicText: ({ node }) => <div>Comic Text</div>,
                linkBadge: ({ node }) => <div>Link Badge</div>
            }}
        />
    </div>
}

const queryPageBySlug = async ({
    slug
}: {
    slug: string
}) => {
    const payload = await getPayload({ config })
    const page = await payload.find({
        collection: 'pages',
        where: {
            slug: {
                equals: slug
            }
        }
    })

    return page?.docs?.at(0)
}