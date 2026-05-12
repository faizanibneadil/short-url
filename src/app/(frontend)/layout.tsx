import React from 'react'
import '@/styles/globals.css'
import { StickyFooter } from '@/components/footer'
import { Outfit } from 'next/font/google'
import { cn } from '@/lib/utils'

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
      <body className={cn(outfit.variable, 'antialiased')}>
        <div className="relative w-full">
          <div className="flex h-screen flex-col items-center justify-center gap-10">
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
