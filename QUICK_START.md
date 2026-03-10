# Quick Start

## Backend

```powershell
cd payload
npm run dev
```

Payload should run on `http://localhost:5000`.

## Frontend

```powershell
cd frontend
npm run dev
```

Frontend should run on `http://localhost:3000`.

## Required env files

`payload/.env`

```env
DATABASE_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/techpub?retryWrites=true&w=majority
PAYLOAD_SECRET=change-me
PORT=5000
NODE_ENV=development
```

`frontend/.env.local`

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development
```

## What to test

1. Open `http://localhost:5000/admin`
2. Create the first admin user
3. Add categories, tags, authors, and posts
4. Open `http://localhost:3000`
5. Confirm navbar, footer, homepage sections, listing pages, and detail pages render

## Media

- Local uploads go to `media/`
- On Render free, that storage is not permanent
- Use S3, Cloudinary, or R2 for long-term media later
