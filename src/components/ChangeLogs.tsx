import { Changelog } from "@/payload-types";
import { RichText } from "./RitchText";
import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import dynamic from "next/dynamic";
import { Params, SearchParams } from "@/types";
import { cn } from "@/lib/utils";

export const ChangeLog: React.FC<{
    change: Changelog,
    params: Awaited<Params>,
    searchParams: Awaited<SearchParams>
}> = ({
    change,
    params,
    searchParams
}) => {
        return <div className={cn({
            "prose md:prose-md dark:prose-invert font-(family-name:--font-outfit) w-full p-4": true,
        })}>
            <RichText
                data={change.changes as DefaultTypedEditorState}
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