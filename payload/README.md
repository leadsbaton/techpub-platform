# Payload CMS

Payload powers:

- admin login
- content collections
- dynamic pages
- navigation/footer settings
- media uploads

## Collections

- users
- authors
- media
- categories
- tags
- posts
- pages
- subscribers

## Global

- site-settings

## Environment

Use `payload/.env`:

```env
DATABASE_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/techpub?retryWrites=true&w=majority
PAYLOAD_SECRET=change-me
PORT=5000
NODE_ENV=development
```

## Commands

```powershell
npm run dev
npm run lint
```

## Notes

- The local dev script is pinned to port `5000`
- The config accepts `MONGODB_URI` or `DATABASE_URI`
- Uploads are stored locally in `media/`
- Local disk storage is not durable on Render free
