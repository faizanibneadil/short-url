import { postgresAdapter } from '@payloadcms/db-postgres'
import { HeadingFeature, InlineToolbarFeature, LinkFeature, TextStateFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import sharp from 'sharp'
import { fileURLToPath } from 'url'
import { seoPlugin } from '@payloadcms/plugin-seo';

import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { URLs } from './collections/Urls'
import { Users } from './collections/Users'
import { InlineBlocks } from './InlineBlocks'
import { blocks } from './blocks'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, URLs, Pages],
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
            // @ts-expect-error
            const slug = linkNode.fields.doc?.value?.slug
            return `/${relationTo}/${slug}`
          },
        }),
        TextStateFeature()
      ]
    }
  }),
  cors: [process.env.NEXT_PUBLIC_SERVER_URL!].filter(Boolean),
  csrf: [process.env.NEXT_PUBLIC_SERVER_URL!].filter(Boolean),
  serverURL: process.env.NEXT_PUBLIC_SERVER_URL,
  db: postgresAdapter({
    blocksAsJSON: true,
    readReplicas: [
      process.env.NEON_READ_REPLICA_URI_1!,
      process.env.NEON_READ_REPLICA_URI_2!,
      process.env.NEON_READ_REPLICA_URI_3!
    ],
    pool: {
      connectionString: process.env.NEON_URI
    }
  }),
  sharp,
  plugins: [
    seoPlugin({
      uploadsCollection: 'media',
      generateTitle: ({ doc }) => `short.devslix.com — ${doc?.meta?.title}`,
      generateDescription: ({ doc }) => doc?.meta?.description,
      generateURL: ({ doc, collectionSlug }) => `/${collectionSlug}/${doc?.slug}`,
    })
  ],
})
