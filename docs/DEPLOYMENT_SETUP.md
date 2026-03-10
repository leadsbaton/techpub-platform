**Frontend On Vercel**
Set the project root directory to `frontend`.

Build settings:
```txt
Build Command: npm run build
Output Command: default
Install Command: npm install
```

Environment variables:
```txt
NEXT_PUBLIC_API_URL=https://<your-render-backend-url>
```

Enable automatic deploys from your connected Git branch.

**Backend On Render**
This repo includes [`render.yaml`](/d:/tuchmath/techpub-platform/techpub-platform/render.yaml).

Backend service settings:
```txt
Root Directory: payload
Build Command: npm install && npm run build
Start Command: npm run start
```

Environment variables:
```txt
NODE_ENV=production
PAYLOAD_SECRET=<strong-random-secret>
DATABASE_URI=<your-mongodb-connection-string>
```

Enable automatic deploys from your connected Git branch.

**Verified Local Builds**
- `frontend`: `npm run build` passed
- `payload`: `npm run build` passed after fixing the recursive build script and Payload package version mismatch
