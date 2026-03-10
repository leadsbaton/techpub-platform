# techpub-platform

TechPub is a monorepo with:

- `frontend/`: Next.js public site
- `payload/`: Payload CMS + admin
- `MongoDB Atlas`: shared cloud database for local and hosted environments

## Current architecture

### CMS model
- `users`: admin login accounts with roles
- `authors`: public author profiles
- `media`: images, PDFs, and video files metadata
- `categories`
- `tags`
- `posts`: insights, whitepapers, webinars, case studies
- `pages`: dynamic CMS-managed pages like `/contact`
- `subscribers`
- `site-settings` global: header links, footer links, branding, newsletter copy

### Frontend routes
- `/`: homepage
- `/insights`
- `/whitepapers`
- `/webinars`
- `/case-studies`
- `/categories/[categorySlug]`
- `/authors/[slug]`
- `/tags/[slug]`
- `/<cms-page-slug>` for dynamic pages from Payload

## Local setup

### 1. Backend env
Use `payload/.env`:

```env
DATABASE_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/techpub?retryWrites=true&w=majority
PAYLOAD_SECRET=change-me
PORT=5000
NODE_ENV=development
```

The config accepts either `MONGODB_URI` or `DATABASE_URI`.

### 2. Frontend env
Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

### 3. Run locally

Backend:

```powershell
cd payload
npm run dev
```

Frontend:

```powershell
cd frontend
npm run dev
```

Expected URLs:

- Payload admin: `http://localhost:5000/admin`
- Payload API: `http://localhost:5000/api/posts`
- Frontend: `http://localhost:3000`

## MongoDB connection

- Payload connects in [payload.config.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/payload.config.ts)
- It uses `process.env.MONGODB_URI || process.env.DATABASE_URI`
- You do not need local MongoDB if you use MongoDB Atlas
- Local and production can use the same Atlas cluster while you are on free tier

## Media storage

Local development:

- Uploads are stored in the repo-level `media/` folder
- The upload config lives in [Media.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/collections/Media.ts)

Free hosting reality:

- Render free disk is ephemeral
- That means locally uploaded images/files can disappear after restart or redeploy
- For testing, local disk storage is fine
- For real production media, use S3, Cloudinary, or Cloudflare R2

## Figma status

Figma MCP is configured, but this file is not accessible from the authenticated account.

Current MCP auth:

- Email: `djdas000000@gmail.com`
- Plan: Starter

What is needed:

1. Give that account access to the Figma file, or
2. Re-authenticate MCP with the Figma account that owns the design

Until that is fixed, I can implement UI from local code and screenshots, but I cannot inspect the design directly through MCP.

## Verification status

Verified:

- `frontend`: `npm run lint` passed
- `payload`: `npm run lint` passed

Blocked by this sandbox:

- `frontend` build hits Windows `spawn EPERM`
- `payload generate:types` hits Windows `spawn EPERM`
- `next dev` also needs unrestricted local process spawning in this environment

## Deployment

Recommended free-tier stack:

- Frontend: Vercel free
- CMS: Render free
- Database: MongoDB Atlas free

Important:

- Vercel free is fine for the frontend
- Render free is fine for CMS testing
- Atlas free is fine for content and admin testing
- Do not rely on Render local disk for permanent media storage

## Main implementation files

- [payload/src/payload.config.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/payload.config.ts)
- [payload/src/collections/Posts.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/collections/Posts.ts)
- [payload/src/collections/Pages.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/collections/Pages.ts)
- [payload/src/globals/SiteSettings.ts](/d:/tuchmath/techpub-platform/techpub-platform/payload/src/globals/SiteSettings.ts)
- [frontend/lib/api/cms.ts](/d:/tuchmath/techpub-platform/techpub-platform/frontend/lib/api/cms.ts)
- [frontend/app/(public)/page.tsx](/d:/tuchmath/techpub-platform/techpub-platform/frontend/app/(public)/page.tsx)
