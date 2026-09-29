import React from 'react'
import '@/styles/globals.css'
import { StickyFooter } from '@/components/footer'
import { Outfit } from 'next/font/google'
import { cn } from '@/lib/utils'
import { GoogleTagManager } from '@next/third-parties/google'
import { queryGlobals } from '@/utilities/queries/queryGlobals'
import { DataFromGlobalSlug } from 'payload'
import { Header } from '@/components/header'

export const metadata = {
  description: 'URL Shortener by DevSlix - Modern, fast and production-grade link management solution.',
  title: 'URL Shortener | DevSlix',
}

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-outfit'
})

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  const header = await queryGlobals({
    slug: 'header'
  }) as DataFromGlobalSlug<'header'>

  const footer = await queryGlobals({
    slug: 'footer',
    depth: 4
  }) as DataFromGlobalSlug<'footer'>

  return (
    <html lang="en" className="dark">
      <GoogleTagManager gtmId="GTM-5HP8ZQMR" />
      <body className={cn(outfit.variable, 'antialiased bg-background text-foreground font-(family-name:--font-outfit) min-h-screen flex flex-col selection:bg-primary/20 selection:text-primary')}>
        <div className="relative w-full min-h-screen flex flex-col">
          <div className="fixed inset-0 -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#212121_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none" />
          <Header headerProps={header} />
          <main className="flex-1 w-full">
            {children}
          </main>
          <StickyFooter footerProps={footer} />
        </div>
      </body>
    </html>
  )
}
