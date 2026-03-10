# Frontend

Next.js public app for TechPub.

## Routes

- `/`
- `/insights`
- `/whitepapers`
- `/webinars`
- `/case-studies`
- `/categories/[categorySlug]`
- `/authors/[slug]`
- `/tags/[slug]`
- `/<cms-page-slug>`

## Environment

Create `frontend/.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## Commands

```powershell
npm run dev
npm run lint
```

## Data source

The app reads from Payload through [frontend/lib/api/cms.ts](/d:/tuchmath/techpub-platform/techpub-platform/frontend/lib/api/cms.ts).
