import dynamic from 'next/dynamic'
import { cn } from '@/lib/utils'
import type { TComicTextPropsType, TLinkBadgePropType, TURLShortenerPropType } from '@/payload-types'
import type { Params, SearchParams } from '@/types'
import {
    DefaultNodeTypes,
    SerializedBlockNode,
    SerializedInlineBlockNode,
    type DefaultTypedEditorState,
} from '@payloadcms/richtext-lexical'
import {
    JSXConvertersFunction,
    RichText as ConvertRichText,
    LinkJSXConverter
} from '@payloadcms/richtext-lexical/react'


type NodeTypes =
    | DefaultNodeTypes
    | SerializedBlockNode<TURLShortenerPropType>
    | SerializedInlineBlockNode<TLinkBadgePropType | TComicTextPropsType>

const jsxConverters: (args: {
    params: Awaited<Params>,
    searchParams: Awaited<SearchParams>
    blocks?: ReturnType<JSXConvertersFunction<NodeTypes>>['blocks']
    inlineBlocks?: ReturnType<JSXConvertersFunction<NodeTypes>>['inlineBlocks']
}) => JSXConvertersFunction<NodeTypes> = ({ params, searchParams, blocks, inlineBlocks }) => {
    return ({ defaultConverters }) => ({
        ...defaultConverters,
        ...LinkJSXConverter({
            internalDocToHref: ({ linkNode }) => {
                const relationTo = linkNode.fields.doc?.relationTo
                // @ts-expect-error
                const slug = linkNode.fields.doc?.value?.slug
                return `/${relationTo}/${slug}`
            },
        }),
        ...(Boolean(Object.keys(blocks || {}).length) && { blocks: { ...blocks } }),
        ...(Boolean(Object.keys(inlineBlocks || {}).length) && { inlineBlocks: { ...inlineBlocks } }),
    })
}


type Props = {
    data: DefaultTypedEditorState
    enableGutter?: boolean
    enableProse?: boolean
    blocks?: ReturnType<JSXConvertersFunction<NodeTypes>>['blocks']
    inlineBlocks?: ReturnType<JSXConvertersFunction<NodeTypes>>['inlineBlocks']
} & React.HTMLAttributes<HTMLDivElement> & { params: Awaited<Params> } & { searchParams: Awaited<SearchParams> }

export const RichText: React.FC<Props> = (props) => {
    const {
        className,
        enableProse = true,
        enableGutter = true,
        params,
        searchParams,
        blocks,
        inlineBlocks,
        ...rest
    } = props
    return (
        <ConvertRichText
            converters={jsxConverters({ params, searchParams, blocks, inlineBlocks })}
            className={cn('payload-richtext w-full mb-5', {
                container: enableGutter,
                'max-w-none': !enableGutter,
                'mx-auto prose md:prose-md dark:prose-invert': enableProse,
            },
                className,
            )}
            disableContainer={true}
            {...rest}
        />
    )
}