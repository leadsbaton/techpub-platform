# COMMAND LINE DEPLOYMENT - WORKING VERSION

## BACKEND DEPLOY TO RENDER (FIXED - NO IMPORT MAP):

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New" → "Web Service"
4. Connect your GitHub repo
5. Configure:
   - Root Directory: payload
   - Build Command: npm install && npm run build
   - Start Command: npm start
6. Add these Environment Variables:
   - DATABASE_URI=mongodb+srv://djdas000000_db_user:8njeZCz2yQTzoh59@cluster0.voa14zn.mongodb.net/techpub?retryWrites=true&w=majority
   - PAYLOAD_SECRET=techpub-secret-key-super-strong-2025-random-string-for-security
   - NODE_ENV=production
7. Click "Create Web Service"
8. Wait for deployment (5-10 minutes)
9. Note your backend URL (like: https://techpub-backend.onrender.com)

## FRONTEND DEPLOY TO VERCEL (ALREADY DONE):

✅ Your frontend is already deployed at: https://techpub-platform.vercel.app

10. Update Vercel Environment Variable:
    - Go to Vercel project → Settings → Environment Variables
    - Set NEXT_PUBLIC_API_URL=https://your-backend-url.onrender.com
    - Click "Redeploy"

## FIXES APPLIED:
- ✅ Removed problematic importMap from payload.config.ts
- ✅ Frontend deployed successfully 
- ✅ Build command simplified: npm install && npm run build

## DONE! Your Live URLs:
- Admin: https://your-render-url.onrender.com/admin
- Website: https://techpub-platform.vercel.app