'use client'

import { RichText } from "@/components/RitchText"
import type { TURLShortenerPropType } from "@/payload-types"
import { Params, SearchParams } from "@/types"
import { DefaultTypedEditorState } from "@payloadcms/richtext-lexical"
import { hasText } from '@payloadcms/richtext-lexical/shared'
import TextareaAutosize from "react-textarea-autosize"
import Form from 'next/form'
import { CreateURL } from "./create"
import { useActionState, useEffect, useState, useTransition } from "react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { canUseDOM } from "@/utilities/canUseDOM"
import { formatShortURL } from "@/utilities/getURL"
import { Link2, Copy, Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Zap, ExternalLink } from "lucide-react"

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
        }, 2000)

        return () => {
            clearTimeout(timerID)
        }
    }, [isCopied])

    return (
        <section id={id || 'shorten'} aria-label={blockName ?? blockType} className="w-full max-w-3xl mx-auto flex flex-col items-center justify-center text-center">
            {heading && (
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-4 text-center text-foreground flex items-center justify-center gap-2">
                    <Link2 className="size-5 text-primary" />
                    <span>{heading}</span>
                </h2>
            )}

            <div className="relative w-full group rounded-3xl bg-gradient-to-b from-primary/30 via-border/50 to-border/20 p-1 md:p-1.5 shadow-2xl transition-all duration-300 hover:shadow-primary/20">
                <div className="rounded-[22px] bg-card/95 backdrop-blur-xl p-4 md:p-6 border border-border/60 shadow-inner flex flex-col items-center">
                    <Form action={CreateShortURL} className="w-full space-y-4">
                        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-3 w-full">
                            <div className="relative flex-1 flex items-center w-full">
                                <div className="absolute left-4 text-muted-foreground pointer-events-none">
                                    <Link2 className="size-5 text-primary/80" />
                                </div>
                                <TextareaAutosize
                                    disabled={isCreating}
                                    name="url"
                                    required
                                    rows={1}
                                    className="flex w-full min-h-[56px] max-h-36 resize-none rounded-2xl bg-muted/50 pl-12 pr-4 py-4 text-sm md:text-base font-medium text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary focus:bg-background border border-border/40 transition-all shadow-xs text-left"
                                    placeholder="Paste your long link here (e.g. https://devslix.com/very-long-url-path)..."
                                />
                            </div>

                            <Button
                                disabled={isCreating}
                                type="submit"
                                size="lg"
                                className={cn(
                                    "rounded-2xl font-extrabold px-8 h-[56px] min-w-[160px] shadow-lg shadow-primary/25 transition-all hover:scale-[1.02] active:scale-[0.98] justify-center items-center",
                                    Boolean(URLState?.errorMessage)
                                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        : "bg-gradient-to-r from-primary to-indigo-600 hover:from-primary/90 hover:to-indigo-600/90 text-primary-foreground"
                                )}
                            >
                                {isCreating ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <Sparkles className="size-4 animate-spin" />
                                        <span>Shortening...</span>
                                    </span>
                                ) : Boolean(URLState?.errorMessage) ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <AlertCircle className="size-4" />
                                        <span>Try Again</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center justify-center gap-2">
                                        <span>Shorten Link</span>
                                        <ArrowRight className="size-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </Form>

                    {/* Result Output State */}
                    {URLState?.shortURL && (
                        <div className="mt-5 p-4 md:p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-600 dark:text-emerald-400 flex flex-col sm:flex-row items-center justify-between gap-4 animate-in fade-in slide-in-from-top-3 duration-300 shadow-md w-full">
                            <div className="flex items-center gap-3 min-w-0 w-full sm:w-auto text-left">
                                <div className="size-10 rounded-xl bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Check className="size-5 text-emerald-500" />
                                </div>
                                <div className="min-w-0 flex-1">
                                    <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600/90 dark:text-emerald-400/90 block">
                                        Shortened Link Ready
                                    </span>
                                    <div className="flex items-center gap-1.5 min-w-0">
                                        <Link
                                            href={formatShortURL(URLState?.shortURL)}
                                            target="_blank"
                                            className="font-extrabold text-base md:text-lg hover:underline truncate text-foreground flex items-center gap-1"
                                        >
                                            <span>{formatShortURL(URLState?.shortURL)}</span>
                                            <ExternalLink className="size-3.5 opacity-70" />
                                        </Link>
                                    </div>
                                </div>
                            </div>

                            <Button
                                size="default"
                                variant="outline"
                                className="w-full sm:w-auto shrink-0 rounded-xl bg-background hover:bg-emerald-500/15 border-emerald-500/40 text-foreground font-bold gap-2 px-5 py-2.5 shadow-xs justify-center"
                                onClick={() => onCopy(formatShortURL(URLState?.shortURL!))}
                            >
                                {isCopying ? (
                                    <span>Copying...</span>
                                ) : isCopied ? (
                                    <>
                                        <Check className="size-4 text-emerald-500" />
                                        <span className="text-emerald-500">Copied!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-4" />
                                        <span>Copy Short URL</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Error Output State */}
                    {URLState?.errorMessage && (
                        <div className="mt-4 p-4 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center justify-center gap-3 animate-in fade-in duration-200 w-full text-center">
                            <AlertCircle className="size-5 shrink-0" />
                            <p className="font-semibold">{URLState?.errorMessage}</p>
                        </div>
                    )}

                    {/* Trust Badges Bar */}
                    <div className="mt-4 pt-4 border-t border-border/40 flex flex-wrap items-center justify-around text-xs text-muted-foreground gap-3 w-full">
                        <div className="flex items-center gap-1.5 justify-center">
                            <Zap className="size-4 text-amber-500" />
                            <span className="font-medium">Sub-50ms Global Latency</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                            <ShieldCheck className="size-4 text-emerald-500" />
                            <span className="font-medium">SSL Encrypted & Safe</span>
                        </div>
                        <div className="flex items-center gap-1.5 justify-center">
                            <Sparkles className="size-4 text-primary" />
                            <span className="font-medium">No Expiration Limit</span>
                        </div>
                    </div>
                </div>
            </div>

            {hasText(description) && (
                <div className="mt-4 text-center text-muted-foreground text-xs md:text-sm max-w-xl mx-auto">
                    <RichText data={description as DefaultTypedEditorState} params={params} searchParams={searchParams} />
                </div>
            )}
        </section>
    )
}
