import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { s3Storage } from '@payloadcms/storage-s3'
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
// The admin's own public URL. In production it MUST be in the CORS/CSRF allow-list
// below — otherwise the admin panel's own write requests are rejected with
// "You are not allowed to perform this action". We fall back to the known Render
// URL (NOT localhost) so the admin still works if PAYLOAD_PUBLIC_URL is unset.
const payloadURL =
  process.env.PAYLOAD_PUBLIC_URL ||
  (isProduction ? 'https://techpub-platform.onrender.com' : `http://localhost:${process.env.PORT || '5000'}`)
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

// Object storage for media (Supabase Storage or any S3-compatible service).
// When configured, uploads go to a SHARED bucket so local and production see the
// exact same files — fixing the "image missing on disk" 500s caused by Render's
// ephemeral, non-shared local disk. Keep the bucket PRIVATE: files are streamed
// through Payload's access-controlled /api/media route, so nothing is reachable
// directly from the bucket without going through the CMS.
//
// Set these in BOTH payload/.env (local) and the Render dashboard (prod):
//   S3_BUCKET, S3_ENDPOINT, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, S3_REGION
// For Supabase: Storage -> S3 Connection gives the endpoint
//   (https://<ref>.supabase.co/storage/v1/s3), region, and access keys.
const s3Configured = Boolean(
  process.env.S3_BUCKET &&
    process.env.S3_ENDPOINT &&
    process.env.S3_ACCESS_KEY_ID &&
    process.env.S3_SECRET_ACCESS_KEY,
)

const storagePlugins = s3Configured
  ? [
      s3Storage({
        collections: {
          media: { disableLocalStorage: true },
        },
        bucket: process.env.S3_BUCKET as string,
        config: {
          endpoint: process.env.S3_ENDPOINT,
          region: process.env.S3_REGION || 'us-east-1',
          // Supabase (and most non-AWS S3 services) require path-style URLs.
          forcePathStyle: true,
          credentials: {
            accessKeyId: process.env.S3_ACCESS_KEY_ID as string,
            secretAccessKey: process.env.S3_SECRET_ACCESS_KEY as string,
          },
        },
      }),
    ]
  : []

export default buildConfig({
  // Setting serverURL in production pins the admin to its canonical origin so
  // generated links and same-origin write requests line up with the allow-list.
  // Left unset in dev so the panel works from either localhost or 127.0.0.1.
  ...(isProduction && payloadURL ? { serverURL: payloadURL } : {}),
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
      icons: [{ rel: 'icon', type: 'image/png', url: '/leads-baton-logo.png' }],
    },
    // Live Preview: the post editor gets a "Live Preview" view that renders the
    // real frontend (via /preview/post) and refreshes as you fill in fields. The
    // preview route fills sensible defaults for empty fields (title, image
    // placeholder, dummy content) and matches each of the 3 post types.
    livePreview: {
      collections: ['posts'],
      url: ({ data }) => {
        const str = (v: unknown) => (typeof v === 'string' ? v : '')
        const params = new URLSearchParams()
        if (str(data.slug)) params.set('slug', str(data.slug))
        if (str(data.type)) params.set('type', str(data.type))
        if (str(data.title)) params.set('title', str(data.title))
        if (str(data.excerpt)) params.set('excerpt', str(data.excerpt))
        params.set('status', str(data.status) || 'draft')
        const qs = params.toString()
        return qs ? `${frontendURL}/preview/post?${qs}` : `${frontendURL}/preview/post`
      },
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
  plugins: [...storagePlugins],
})
