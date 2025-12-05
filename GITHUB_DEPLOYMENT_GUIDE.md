# 🚀 Deploy Your Full Project - GitHub → Vercel & Render

## ✅ Your Setup Status:
- ✅ Project in one GitHub repository
- ✅ MongoDB Atlas connected and working
- ✅ Backend (Payload) ready to deploy
- ✅ Frontend (Next.js) ready to deploy

## 🎯 Step 1: Deploy Backend (Payload) to Render

### Option A: Direct GitHub Connection (Recommended)
1. **Go to Render.com**
   - Visit: https://render.com
   - Sign up with GitHub (so you can connect your repo)

2. **Create New Web Service**
   - Click "New" → "Web Service"
   - Click "Build and deploy from a Git repository"
   - Sign in with GitHub and connect your repository

3. **Configure Service**
   - **Name**: `techpub-backend` (or your preference)
   - **Branch**: `main`
   - **Root Directory**: `payload` (IMPORTANT!)
   - **Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`

4. **Set Environment Variables in Render**
   Go to Render Dashboard → Settings → Environment Variables:
   ```env
   DATABASE_URI=mongodb+srv://djdas000000_db_user:8njeZCz2yQTzoh59@cluster0.voa14zn.mongodb.net/techpub?retryWrites=true&w=majority
   PAYLOAD_SECRET=techpub-secret-key-super-strong-2025-random-string-for-security
   NODE_ENV=production
   PORT=5000
   ```

5. **Deploy and Get URL**
   - Click "Create Web Service"
   - Wait for deployment (2-5 minutes)
   - You'll get a URL like: `https://techpub-backend.onrender.com`

### Option B: Manual Upload
If GitHub integration doesn't work:
1. Create zip of your `payload` folder
2. Upload to Render manually
3. Same configuration as above

## 🎨 Step 2: Deploy Frontend (Next.js) to Vercel

### Option A: GitHub Integration (Recommended)
1. **Go to Vercel.com**
   - Visit: https://vercel.com
   - Sign up with GitHub

2. **Import Project**
   - Click "New Project"
   - Choose "Import Git Repository"
   - Select your GitHub repo

3. **Configure Project**
   - **Framework Preset**: Next.js
   - **Root Directory**: `frontend` (IMPORTANT!)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

4. **Set Environment Variables in Vercel**
   In Vercel project settings → Environment Variables:
   ```env
   NEXT_PUBLIC_API_URL=https://your-render-backend-url.onrender.com
   NODE_ENV=production
   ```
   **Important**: Replace `your-render-backend-url` with your actual Render URL!

5. **Deploy and Get URL**
   - Click "Deploy"
   - Get your frontend URL: `https://your-project.vercel.app`

## 🔗 Step 3: Connect Frontend to Backend

### Update Vercel Environment Variables:
1. Go to your Vercel project dashboard
2. Settings → Environment Variables
3. Update `NEXT_PUBLIC_API_URL` with your actual Render URL:
   ```env
   NEXT_PUBLIC_API_URL=https://techpub-backend.onrender.com
   ```

### Test the Connection:
1. Visit your Vercel frontend URL
2. Check if it loads without errors
3. Your frontend should now connect to your production backend

## 📋 Step 4: Production URLs

After both deployments, you'll have:
- **Backend Admin**: `https://techpub-backend.onrender.com/admin`
- **Backend API**: `https://techpub-backend.onrender.com/api/*`
- **Frontend Website**: `https://your-app.vercel.app`

## 🚨 Important Notes:

### 1. Order of Deployment:
1. Deploy backend first (Render)
2. Note your backend URL
3. Deploy frontend (Vercel) with that URL

### 2. Environment Variables:
- **Render**: Needs DATABASE_URI, PAYLOAD_SECRET
- **Vercel**: Needs NEXT_PUBLIC_API_URL (pointing to Render)

### 3. Free Tier Limitations:
- **Render**: Sleeps after 15 minutes (wake up takes ~30 seconds)
- **Vercel**: Excellent for Next.js, no sleep issues
- **MongoDB**: Free tier has limits but fine for starting

## ✅ Production Checklist:

### Backend (Render):
- [ ] Backend deploys successfully
- [ ] Admin panel accessible: `/admin`
- [ ] Database connects properly
- [ ] API endpoints respond

### Frontend (Vercel):
- [ ] Frontend deploys successfully
- [ ] Connects to production backend
- [ ] No API connection errors
- [ ] Website loads properly

### Full Stack:
- [ ] Can create content in admin panel
- [ ] Content appears on frontend
- [ ] User authentication works
- [ ] Database operations work

## 🎉 Success! Your Live URLs:
- **Admin Panel**: `https://your-render-url.onrender.com/admin`
- **Your Website**: `https://your-vercel-url.vercel.app`

## 🆘 If Something Goes Wrong:

### Backend Issues:
- Check Render build logs
- Verify all environment variables
- Ensure MongoDB Atlas is accessible

### Frontend Issues:
- Check Vercel build logs
- Verify NEXT_PUBLIC_API_URL is correct
- Clear browser cache

### Connection Issues:
- Verify both services are deployed
- Check CORS settings in Payload config
- Ensure backend URL is accessible

**That's it! Your full-stack app will be live!** 🚀