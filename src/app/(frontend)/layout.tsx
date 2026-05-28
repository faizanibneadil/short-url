import React from 'react'
import '@/styles/globals.css'
import { StickyFooter } from '@/components/footer'
import { Outfit } from 'next/font/google'
import { cn } from '@/lib/utils'
import { GoogleTagManager } from '@next/third-parties/google'
import { BackgroundRippleEffect } from '@/components/background-ripple-effect'
import { queryGlobals } from '@/utilities/queries/queryGlobals'
import { DataFromGlobalSlug } from 'payload'
import { Header } from '@/components/header'

export const metadata = {
  description: 'A blank template using Payload in a Next.js app.',
  title: 'Payload Blank Template',
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
    <html lang="en">
      <GoogleTagManager gtmId="GTM-5HP8ZQMR" />
      <body className={cn(outfit.variable, 'antialiased')}>
        <div className="relative w-full">
          <div className="absolute h-full w-full -z-10 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] dark:bg-[radial-gradient(#212121_1px,transparent_1px)] [background-size:16px_16px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]" />
          {/* <BackgroundRippleEffect /> */}
          <Header headerProps={header} />
          <main className="max-w-2xl mx-auto">
            {children}
          </main>
          <StickyFooter footerProps={footer} />
        </div>
      </body>
    </html>
  )
}
