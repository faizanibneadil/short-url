'use client'
import { RichText } from "@/components/RitchText";
import { InputGroup, InputGroupAddon, InputGroupButton } from "@/components/ui/input-group";
import type { TURLShortenerPropType } from "@/payload-types";
import { Params, SearchParams } from "@/types";
import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical";
import { hasText } from '@payloadcms/richtext-lexical/shared';
import TextareaAutosize from "react-textarea-autosize";
import Form from 'next/form'
import { CreateURL } from "./create";
import { useActionState, useEffect, useState, useTransition } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { canUseDOM } from "@/utilities/canUseDOM";
import { getClientSideURL } from "@/utilities/getURL";


export const URLShortener: React.FC<{ blockProps: TURLShortenerPropType } & { params: Awaited<Params>, searchParams: Awaited<SearchParams> }> = (props) => {
    const {
        blockProps,
        params,
        searchParams
    } = props || {}

    const {
        blockType,
        blockName,
        description,
        heading,
        id,
    } = blockProps || {}

    const [URLState, CreateShortURL, isCreating] = useActionState(CreateURL, {
        errorMessage: null,
        success: false,
        shortURL: null
    })

    const [isCopying, startCopyUrlTransaction] = useTransition()
    const [isCopied, setCopied] = useState(false)

    const onCopy = (url: string) => {
        startCopyUrlTransaction(async () => {
            if (URLState?.shortURL) {
                if (canUseDOM()) {
                    if ('navigator' in window) {
                        if ('clipboard' in navigator) {
                            await navigator.clipboard.writeText(url).then(() => {
                                setCopied(true)
                            })
                        }
                    }
                }
            }
        })
    }


    useEffect(() => {
        if (!isCopied) {
            return
        }

        const timerID = setTimeout(() => {
            setCopied(false)
        }, 1000)

        return () => {
            clearTimeout(timerID)
        }
    }, [isCopied])

    return (
        <section id={id!} aria-label={blockName ?? blockType} className="w-full">
            <h2 className="text-sm">{heading}</h2>
            <div className={cn("overflow-hidden rounded-lg bg-muted p-0.5 dark:bg-muted/50", {
                'bg-red-600': Boolean(URLState?.errorMessage),
                'bg-green-600': Boolean(URLState?.shortURL)
            })}>
                <Form action={CreateShortURL} className="rounded-lg bg-background shadow-xs">
                    <InputGroup>
                        <TextareaAutosize
                            disabled={isCreating}
                            name="url"
                            data-slot="input-group-control"
                            className="flex field-sizing-content min-h-16 w-full resize-none rounded-lg bg-transparent px-3 py-2.5 text-base transition-[color,box-shadow] outline-none md:text-sm"
                            placeholder="https://www.google.com?search=how+to+use+youtube"
                        />
                        <InputGroupAddon align="block-end">
                            <InputGroupButton disabled={isCreating} type="submit" className="ml-auto" size="sm" variant={Boolean(URLState?.errorMessage) ? "destructive" : "default"}>
                                {isCreating
                                    ? 'Generating ...'
                                    : Boolean(URLState?.errorMessage)
                                        ? 'Regenerate'
                                        : 'Generate'}
                            </InputGroupButton>
                        </InputGroupAddon>
                    </InputGroup>
                </Form>
                {URLState?.shortURL && (
                    <div className="flex items-center justify-between gap-2 text-sm h-4 py-6 px-2">
                        {/* <span>URL:</span> */}
                        <Badge variant='secondary' render={<Link className=" font-bold" href={`${getClientSideURL()}/short/${URLState.shortURL}`}>{getClientSideURL()}/short/{URLState?.shortURL}</Link>} />
                        <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onCopy(`${getClientSideURL()}/short/${URLState?.shortURL}`)}
                        >
                            {isCopying
                                ? 'Copying ...'
                                : isCopied
                                    ? 'Copied'
                                    : 'Copy URL'}
                        </Button>
                    </div>
                )}
                {URLState?.errorMessage && (
                    <div className="flex items-center gap-2 text-sm h-4 py-4 px-2">
                        <p className="text-white font-bold">{URLState?.errorMessage}</p>
                    </div>
                )}
            </div>
            {hasText(description) && (
                <p className="text-muted-foreground text-sm prose md:prose-md dark:prose-invert font-(family-name:--font-outfit)">
                    <RichText data={description as DefaultTypedEditorState} params={params} searchParams={searchParams} />
                </p>
            )}
        </section >
    )
}