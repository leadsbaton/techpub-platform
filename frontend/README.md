This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Feature-wise colocation

frontend/
├── app/
│ ├── layout.tsx ← Root layout (HTML, fonts, global styles)
│ ├── globals.css
│ │
│ ├── (public)/
│ │ ├── layout.tsx ← Public layout (Header + Footer)
│ │ ├── page.tsx ← Homepage
│ │ ├── loading.tsx ← Loading UI for public pages
│ │ ├── error.tsx ← Error boundary for public pages
│ │ ├── not-found.tsx ← 404 page for public routes
│ │ │
│ │ ├── \_components/ ← Private folder (shared public components)
│ │ │ ├── Header/
│ │ │ │ ├── index.tsx
│ │ │ │ └── Navigation.tsx
│ │ │ ├── Footer/
│ │ │ │ └── index.tsx
│ │ │ └── HeroSection/
│ │ │ └── index.tsx
│ │ │
│ │ ├── \_lib/ ← Private folder (utilities for public routes)
│ │ │ └── api.ts ← API fetching utilities
│ │ │
│ │ ├── [contentType]/
│ │ │ ├── page.tsx ← Content listing (/insights, /whitepapers)
│ │ │ ├── loading.tsx ← Loading UI for this route
│ │ │ ├── error.tsx ← Error boundary for this route
│ │ │ │
│ │ │ ├── \_components/ ← Components specific to content listing
│ │ │ │ ├── ContentList.tsx
│ │ │ │ ├── ContentGrid.tsx
│ │ │ │ └── ContentCard.tsx
│ │ │ │
│ │ │ └── [slug]/
│ │ │ ├── page.tsx ← Content detail page
│ │ │ ├── loading.tsx ← Loading UI for detail page
│ │ │ ├── error.tsx ← Error boundary for detail page
│ │ │ │
│ │ │ └── \_components/ ← Components specific to detail page
│ │ │ ├── ContentDetail.tsx
│ │ │ ├── RelatedContent.tsx
│ │ │ └── ShareButtons.tsx
│ │ │
│ │ └── categories/
│ │ ├── [categorySlug]/
│ │ │ ├── page.tsx ← Category landing page
│ │ │ ├── loading.tsx
│ │ │ ├── error.tsx
│ │ │ │
│ │ │ └── \_components/ ← Category-specific components
│ │ │ └── CategoryView.tsx
│ │ │
│ │ └── \_lib/ ← Category utilities
│ │ └── utils.ts
│ │
│ └── api/ ← API routes (if needed)
│ └── ...
│
└── components/ ← Only truly global/shared components
└── ui/ ← Base UI primitives (Button, Card, etc.)
├── Button.tsx
└── Card.tsx
