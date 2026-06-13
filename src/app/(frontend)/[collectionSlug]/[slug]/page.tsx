import { RichText } from "@/components/RitchText";
import { cn } from '@/lib/utils';
import type { Page, StructuredSchema } from "@/payload-types";
import { Params, SearchParams } from '@/types';
import { formatCanonicalURL } from "@/utilities/formatCanonicalURL";
import { getServerSideURL } from '@/utilities/getURL';
// import { queryPageBySlug } from '@/utilities/queries/queryPageBySlug';
import { DefaultTypedEditorState } from '@payloadcms/richtext-lexical';
import { Metadata } from 'next';
import dynamic from 'next/dynamic';
import { notFound } from "next/navigation";
import { getPayload } from "payload";
import config from '@payload-config'

export async function generateMetadata(props: {
    params: Params,
    searchParams: SearchParams
}): Promise<Metadata> {
    const payload = await getPayload({ config })
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    const page = await payload.kv.get<Page>(params.slug)
    // await queryPageBySlug({
    //     slug: params.slug
    // })

    if (!page) {
        return {
            title: '404 - Page Not Found',
            description: '404 - Page Not Found'
        }
    }

    const __baseURL = getServerSideURL()

    return {
        title: page?.meta?.title,
        description: page?.meta?.description,
        keywords: page?.meta?.keywords,
        openGraph: {
            title: page?.meta?.title || '',
            description: page?.meta?.description || '',
            url: "https://short.devslix.com",
            siteName: "Short by DevSlix",
            type: "website",
        },
        metadataBase: new URL(__baseURL),
        authors: {
            name: 'DevSlix',
            url: 'https://devslix.com'
        },
        alternates: {
            canonical: formatCanonicalURL({ doc: page, collectionSlug: params.collectionSlug })
        },
        robots: {
            index: page?.meta?.index,
            follow: page?.meta?.follow,
        },
        twitter: {
            card: 'summary_large_image',
            title: page?.meta?.title || '',
            description: page?.meta?.description || '',
        }
    }

}

export default async function Page(props: {
    params: Params,
    searchParams: SearchParams
}) {
    const [params, searchParams] = await Promise.all([props.params, props.searchParams])

    const payload = await getPayload({ config })
    const page = await payload.kv.get<Page>(params.slug)
    // await queryPageBySlug({
    //     slug: params.slug
    // })

    if (!page) {
        return notFound()
    }

    return <div className={cn({
        "prose md:prose-md dark:prose-invert font-(family-name:--font-outfit) w-full p-4": true,
    })}>
        {Boolean(page?.meta?.ldSchema_references?.length) && (<script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@graph": [
                        ...(page?.meta?.ldSchema_references?.map(schema => {
                            return (schema.value as StructuredSchema).ld_schema
                        }) ?? []).filter(Boolean)
                    ]
                }),
            }}
        />)}
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
                },
            }}
            inlineBlocks={{
                comicText: ({ node }) => <div>Comic Text</div>,
                linkBadge: ({ node }) => <div>Link Badge</div>,
                rotate_text: ({ node }) => {
                    const RotateText = dynamic(() => import('@/components/RotatingText').then(({ RotatingText }) => ({
                        default: RotatingText
                    })))
                    return <RotateText
                        texts={node.fields.texts}
                        mainClassName={node.fields.main_class_name!}
                        rotationInterval={node.fields.rotation_interval!}
                        staggerDuration={node.fields.stagger_duration!}
                        staggerFrom={node.fields.stagger_from === 'number' ? node.fields.stagger_from_value_in_number! : node.fields.stagger_from!}
                        splitLevelClassName={node.fields.split_level_class_name!}
                        splitBy={node.fields.split_by!}
                        loop={node.fields.enable_loop!}
                        auto={node.fields.enable_auto!}
                    />
                }
            }}
        />
    </div>
}