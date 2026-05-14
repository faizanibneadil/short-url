import React from 'react'
import '@/styles/globals.css'
import { StickyFooter } from '@/components/footer'
import { Outfit } from 'next/font/google'
import { cn } from '@/lib/utils'
import { GoogleTagManager } from '@next/third-parties/google'

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

  return (
    <html lang="en">
      <GoogleTagManager gtmId="GTM-5HP8ZQMR" />
      <body className={cn(outfit.variable, 'antialiased')}>
        <div className="relative w-full">
          <div className="flex h-svh flex-col items-center justify-center gap-10">
            <div className="flex items-center gap-2">
              <main>{children}</main>
            </div>
          </div>
          <StickyFooter />
        </div>
      </body>
    </html>
  )
}
