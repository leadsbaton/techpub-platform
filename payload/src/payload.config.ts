// storage-adapter-import-placeholder
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Posts } from './collections/Posts'
import { ContentTypes } from './collections/ContentTypes'
import { Categories } from './collections/Categories'
import { Tags } from './collections/Tags'
import { Authors } from './collections/Authors'
import { Pages } from './collections/Pages'
import { Subscribers } from './collections/Subscribers'
import { Submissions } from './collections/Submissions'
import { SiteSettings } from './globals/SiteSettings'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const isProduction = process.env.NODE_ENV === 'production'
const frontendURL = process.env.NEXT_PUBLIC_SITE_URL || process.env.FRONTEND_URL || (isProduction ? 'https://techpub-platform.vercel.app' : 'http://localhost:3000')
// In production, only use an explicitly configured public URL — never fall back
// to localhost (which would otherwise re-enter the CORS/CSRF allow-list below).
const payloadURL =
  process.env.PAYLOAD_PUBLIC_URL || (isProduction ? '' : `http://localhost:${process.env.PORT || '5000'}`)
// Only trust localhost/loopback origins outside production. In production these
// must not be in the CORS/CSRF allow-list, or a malicious app on the same host
// as a victim could be treated as a trusted origin against the admin session.
const localhostOrigins = isProduction
  ? []
  : [
      'http://localhost:3000',
      'http://127.0.0.1:3000',
      `http://localhost:${process.env.PORT || '5000'}`,
      `http://127.0.0.1:${process.env.PORT || '5000'}`,
    ]
const allowedOrigins = Array.from(
  new Set([frontendURL, payloadURL, ...localhostOrigins].filter(Boolean)),
)

export default buildConfig({
  admin: {
    components: {
      graphics: {
        Icon: {
          exportName: 'BrandIcon',
          path: './components/admin/BrandIcon',
        },
        Logo: {
          exportName: 'BrandLogo',
          path: './components/admin/BrandLogo',
        },
      },
    },
    meta: {
      titleSuffix: '- TechPub CMS',
    },
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  cors: allowedOrigins,
  csrf: allowedOrigins,
  collections: [
    Users,
    Media,
    ContentTypes,
    Categories,
    Tags,
    Authors,
    Posts,
    Pages,
    Subscribers,
    Submissions,
  ],
  globals: [SiteSettings],
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    // storage-adapter-placeholder
  ],
})
