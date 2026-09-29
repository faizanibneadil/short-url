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
import { Link2, Copy, Check, Sparkles, AlertCircle, ArrowRight, ShieldCheck, Zap } from "lucide-react"

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
        <section id={id || 'shorten'} aria-label={blockName ?? blockType} className="w-full">
            {heading && (
                <h2 className="text-xl md:text-2xl font-bold tracking-tight mb-3 text-foreground flex items-center gap-2">
                    <Link2 className="size-5 text-primary" />
                    <span>{heading}</span>
                </h2>
            )}

            <div className="relative group rounded-2xl bg-gradient-to-b from-border/80 via-border/40 to-border/20 p-1 md:p-1.5 shadow-2xl transition-all duration-300 hover:shadow-primary/10">
                <div className="rounded-xl bg-card/90 backdrop-blur-xl p-3 md:p-5 border border-border/50">
                    <Form action={CreateShortURL} className="space-y-3">
                        <div className="relative flex flex-col md:flex-row items-stretch md:items-center gap-2.5">
                            <div className="relative flex-1 flex items-center">
                                <div className="absolute left-3.5 text-muted-foreground pointer-events-none">
                                    <Link2 className="size-5" />
                                </div>
                                <TextareaAutosize
                                    disabled={isCreating}
                                    name="url"
                                    required
                                    rows={1}
                                    className="flex w-full min-h-[52px] max-h-32 resize-none rounded-xl bg-muted/40 pl-11 pr-4 py-3.5 text-sm md:text-base font-medium placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:bg-background border border-transparent transition-all"
                                    placeholder="Paste your long link here (e.g. https://devslix.com/very-long-url-path)..."
                                />
                            </div>

                            <Button
                                disabled={isCreating}
                                type="submit"
                                size="lg"
                                className={cn(
                                    "rounded-xl font-bold px-6 h-[52px] min-w-[150px] shadow-lg shadow-primary/25 transition-all active:scale-[0.98]",
                                    Boolean(URLState?.errorMessage)
                                        ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                                        : "bg-primary hover:bg-primary/90 text-primary-foreground"
                                )}
                            >
                                {isCreating ? (
                                    <span className="flex items-center gap-2">
                                        <Sparkles className="size-4 animate-spin" />
                                        <span>Shortening...</span>
                                    </span>
                                ) : Boolean(URLState?.errorMessage) ? (
                                    <span className="flex items-center gap-2">
                                        <AlertCircle className="size-4" />
                                        <span>Try Again</span>
                                    </span>
                                ) : (
                                    <span className="flex items-center gap-2">
                                        <span>Shorten Link</span>
                                        <ArrowRight className="size-4" />
                                    </span>
                                )}
                            </Button>
                        </div>
                    </Form>

                    {/* Result Output State */}
                    {URLState?.shortURL && (
                        <div className="mt-4 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                            <div className="flex items-center gap-3 overflow-hidden w-full sm:w-auto">
                                <div className="size-8 rounded-lg bg-emerald-500/20 flex items-center justify-center shrink-0">
                                    <Check className="size-4 text-emerald-500" />
                                </div>
                                <div className="min-w-0">
                                    <span className="text-xs font-semibold uppercase tracking-wider text-emerald-600/80 dark:text-emerald-400/80 block">
                                        Your Shortened Link
                                    </span>
                                    <Link
                                        href={formatShortURL(URLState?.shortURL)}
                                        target="_blank"
                                        className="font-bold text-sm md:text-base hover:underline truncate block text-foreground"
                                    >
                                        {formatShortURL(URLState?.shortURL)}
                                    </Link>
                                </div>
                            </div>

                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full sm:w-auto shrink-0 rounded-lg bg-background hover:bg-emerald-500/10 border-emerald-500/30 text-foreground font-semibold gap-2"
                                onClick={() => onCopy(formatShortURL(URLState?.shortURL!))}
                            >
                                {isCopying ? (
                                    <span>Copying...</span>
                                ) : isCopied ? (
                                    <>
                                        <Check className="size-4 text-emerald-500" />
                                        <span className="text-emerald-500">Copied to Clipboard!</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="size-4" />
                                        <span>Copy Link</span>
                                    </>
                                )}
                            </Button>
                        </div>
                    )}

                    {/* Error Output State */}
                    {URLState?.errorMessage && (
                        <div className="mt-4 p-3.5 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
                            <AlertCircle className="size-4 shrink-0" />
                            <p className="font-semibold">{URLState?.errorMessage}</p>
                        </div>
                    )}

                    {/* Trust Badges Bar */}
                    <div className="mt-3 pt-3 border-t border-border/40 flex flex-wrap items-center justify-between text-xs text-muted-foreground gap-2">
                        <div className="flex items-center gap-1.5">
                            <Zap className="size-3.5 text-amber-500" />
                            <span>Sub-50ms Global Latency</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <ShieldCheck className="size-3.5 text-emerald-500" />
                            <span>SSL Encrypted & Safe</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5 text-primary" />
                            <span>No expiration limit</span>
                        </div>
                    </div>
                </div>
            </div>

            {hasText(description) && (
                <div className="mt-3 text-muted-foreground text-xs md:text-sm">
                    <RichText data={description as DefaultTypedEditorState} params={params} searchParams={searchParams} />
                </div>
            )}
        </section>
    )
}
