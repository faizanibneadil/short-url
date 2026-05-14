import config from '@payload-config'
import { RichText } from "@/components/RitchText";
import { CollectionSlug, getPayload } from "payload";
import { Params, SearchParams } from '@/types';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import dynamic from 'next/dynamic';
import { cn } from '@/lib/utils';
import { Metadata } from 'next';
import { getServerSideURL } from '@/utilities/getURL';

export async function generateMetadata(props: {
    params: Params,
    searchParams: SearchParams
}): Promise<Metadata> {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    const page = await queryPageBySlug({
        slug: params.slug
    })

    if (!page) {
        return {
            title: '404 - Page Not Found',
            description: '404 - Page Not Found'
        }
    }

    const __home = page.slug === 'home'
    const __baseURL = getServerSideURL()

    return {
        title: page?.meta?.title,
        description: page?.meta?.description,
        metadataBase: new URL(__baseURL),
        alternates: {
            canonical: __home ? __baseURL : `${__baseURL}/pages/${page.slug}`,
        },
        robots: {
            index: true,
            follow: true,
        },
        twitter: {
            card: 'summary_large_image',
            title: page?.meta?.title || '',
            description: page?.meta?.description || '',
        },
    }

}

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])
    const page = await queryPageBySlug({
        slug: params.slug
    })
    return <div className={cn({
        "prose md:prose-md dark:prose-invert font-(family-name:--font-outfit) w-full p-4": true,
        "max-w-2xl mx-auto": page?.settings?.enableContainer
    })}>
        <RichText
            data={page?.content as DefaultTypedEditorState}
            params={params}
            searchParams={searchParams}
            blocks={{
                urlShortener: ({ node }) => {
                    const URLShortener = dynamic(() => import('@/blocks/URLShortener/component').then(({ URLShortener }) => ({
                        default: URLShortener
                    })))
                    return <URLShortener blockProps={node.fields} params={params} searchParams={searchParams} />
                }
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