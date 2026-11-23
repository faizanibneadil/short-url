import fs from 'fs'
import { sqliteD1Adapter } from '@payloadcms/db-d1-sqlite'
import { r2Storage } from '@payloadcms/storage-r2'
import { CloudflareContext, getCloudflareContext } from '@opennextjs/cloudflare'
import { GetPlatformProxyOptions } from 'wrangler'
import { HeadingFeature, InlineToolbarFeature, LinkFeature, TextStateFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import { seoPlugin } from '@payloadcms/plugin-seo';
// import { redisKVAdapter } from '@payloadcms/kv-redis'

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { URLs } from './collections/Urls'
import { Users } from './collections/Users'
import { InlineBlocks } from './InlineBlocks'
import { blocks } from './blocks'
import { getServerSideURL } from './utilities/getURL'
import { Settings } from './globals/Settings'
import { Footer } from './globals/Footer'
import { Header } from './globals/Header'
import { Blogs } from './collections/Blogs'
import { StructuredSchemas } from './collections/StructuredSchemas'
import { Changelogs } from './collections/Changelogs'
import { Page } from './payload-types'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const realpath = (value: string) => {
  try {
    return fs.existsSync(value) ? fs.realpathSync(value) : undefined
  } catch {
    return undefined
  }
}

const isCLI = process.argv.some((value) => {
  const resolved = realpath(value)
  if (!resolved) return false
  return (
    resolved.endsWith(path.join('payload', 'bin.js')) ||
    resolved.endsWith(path.join('next', 'dist', 'bin', 'next'))
  )
})
const isProduction = process.env.NODE_ENV === 'production'
// `next build` evaluates this config while collecting page data. Use our own wrangler proxy there
// too, so preview builds can be pointed at the preview D1/R2 via PAYLOAD_WRANGLER_CONFIG.
const isBuild = process.env.NEXT_PHASE === 'phase-production-build'

// Payload's default logger (pino-pretty) uses Node APIs that are not available on Workers
const createLog =
  (level: string, fn: typeof console.log) => (objOrMsg: object | string, msg?: string) => {
    if (typeof objOrMsg === 'string') {
      fn(JSON.stringify({ level, msg: objOrMsg }))
    } else {
      fn(JSON.stringify({ level, ...objOrMsg, msg: msg ?? (objOrMsg as { msg?: string }).msg }))
    }
  }

const cloudflareLogger = {
  level: process.env.PAYLOAD_LOG_LEVEL || 'info',
  trace: createLog('trace', console.debug),
  debug: createLog('debug', console.debug),
  info: createLog('info', console.log),
  warn: createLog('warn', console.warn),
  error: createLog('error', console.error),
  fatal: createLog('fatal', console.error),
  silent: () => {},
} as any

const cloudflare =
  isCLI || isBuild || !isProduction
    ? await getCloudflareContextFromWrangler()
    : await getCloudflareContext({ async: true })

// Production: https://url.devslix.com (set by CI). Previews: their own Preview URL (set by CI).
// Local dev: NEXT_PUBLIC_SERVER_URL from .env, falling back to http://localhost:3000
const serverURL = getServerSideURL()

// Payload matches CORS / CSRF origins exactly (no wildcards), so every origin is listed explicitly.
const allowedOrigins = [
  'https://url.devslix.com',
  'https://clip.devslix.com',
  'https://playground.devslix.com',
  'https://parchi.devslix.com',
  'https://www.parchi.devslix.com',
  ...(isProduction ? [] : ['http://localhost:3000']),
  serverURL,
].filter((origin, index, list) => Boolean(origin) && list.indexOf(origin) === index)

export default buildConfig({
  // kv: cloudflareKVadapter({
  //   cloudflareInstance: new Cloudflare({
  //     apiToken: process.env.CLOUDFLARE_API_TOKEN!,
  //   }),
  //   cloudflareAccountId: process.env.CLOUDFLARE_ACCOUNT_ID!,
  //   cloudflareKvNamespaceId: process.env.CLOUDFLARE_KV_NAMESPACE_ID!
  // }),
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  auth: {
    passwordHashIterations: 100000
  },
  collections: [Users, Media, URLs, Pages, Blogs, StructuredSchemas, Changelogs],
  globals: [Header, Footer, Settings],
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  blocks: [...blocks, ...InlineBlocks],
  editor: lexicalEditor({
    features: ({ defaultFeatures }) => {
      return [
        ...defaultFeatures,
        InlineToolbarFeature(),
        HeadingFeature({
          enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
        }),
        LinkFeature({
          enabledCollections: ['pages'],
          maxDepth: 2,
          internalDocToHref: ({ linkNode }) => {
            const relationTo = linkNode.fields.doc?.relationTo
            console.log(linkNode.fields.doc)
            // @ts-expect-error
            const slug = linkNode.fields.doc?.value?.slug
            return `/${relationTo}/${slug}`
          },
        }),
        TextStateFeature()
      ]
    }
  }),
  cors: allowedOrigins,
  csrf: allowedOrigins,
  serverURL,
  db: sqliteD1Adapter({
    binding: cloudflare.env.D1,
    blocksAsJSON: true,
  }),
  logger: isProduction ? cloudflareLogger : undefined,
  plugins: [
    r2Storage({
      bucket: cloudflare.env.R2,
      collections: { media: true },
    }),
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `url.devslix.com — ${doc?.meta?.title}`,
      generateDescription: ({ doc }) => doc?.meta?.description,
      generateURL: ({ doc, collectionSlug }) => {
        if (collectionSlug === 'pages') {
          const page = doc as Page
          if (page?.enableCollection) {
            return `${getServerSideURL()}/${page?.configuredCollectionSlug}`
          }
        }
        return `${getServerSideURL()}/${collectionSlug}/${doc?.slug}`
      },
    })
  ],
  onInit: async payload => {
    // await InitializePagesCache({ payload })
  }
})

// Adapted from the official Payload `with-cloudflare-d1` template.
// PAYLOAD_WRANGLER_CONFIG lets CI point the Payload CLI (migrations) and the build at the
// preview D1/R2 resources (wrangler.preview-migrations.jsonc) instead of production.
function getCloudflareContextFromWrangler(): Promise<CloudflareContext> {
  return import(/* webpackIgnore: true */ `${'__wrangler'.replaceAll('_', '')}`).then(
    ({ getPlatformProxy }) =>
      getPlatformProxy({
        configPath: process.env.PAYLOAD_WRANGLER_CONFIG || undefined,
        environment: process.env.CLOUDFLARE_ENV,
        remoteBindings: isProduction,
      } satisfies GetPlatformProxyOptions),
  )
}
