import React from "react"
import Link from "next/link"
import { DataFromGlobalSlug } from "payload"
import { Link2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export const Header: React.FC<{ headerProps?: DataFromGlobalSlug<"header"> }> = () => {
  return (
    <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/75 border-b border-border/50 transition-all">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary via-indigo-500 to-purple-600 p-0.5 shadow-md shadow-primary/20 group-hover:scale-105 transition-transform">
            <div className="size-full bg-background rounded-[10px] flex items-center justify-center">
              <Link2 className="size-4 text-primary group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight flex items-center gap-1.5 leading-none">
              url<span className="text-primary">.devslix</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20">
                PRO
              </span>
            </span>
            <span className="text-[10px] text-muted-foreground font-medium leading-tight">
              Enterprise Shortener
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground">
          <Link href="#features" className="hover:text-foreground transition-colors">
            Features
          </Link>
          <Link href="#analytics" className="hover:text-foreground transition-colors">
            Analytics
          </Link>
          <Link href="#api" className="hover:text-foreground transition-colors">
            API Docs
          </Link>
          <Link href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </Link>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <Link
            href="https://github.com/devslix"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground px-3 py-1.5 rounded-lg border border-border/60 hover:border-border transition-colors"
          >
            <svg className="size-3.5 fill-current" viewBox="0 0 24 24">
              <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
            </svg>
            <span>GitHub</span>
          </Link>

          <Button
            size="sm"
            className="rounded-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-4 shadow-sm shadow-primary/25"
            render={
              <a href="#shorten" className="flex items-center gap-1.5">
                <span>Shorten URL</span>
                <Sparkles className="size-3.5" />
              </a>
            }
            nativeButton={false}
          />
        </div>
      </div>
    </header>
  )
}
