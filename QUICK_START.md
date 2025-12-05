# 🚀 TechPub Platform - Quick Start Guide

## What You Have
- **Frontend**: Next.js 14 with React 19 + TailwindCSS
- **Backend**: Payload CMS 3.66.0 with MongoDB
- **Database**: MongoDB Atlas (cloud-based, no local MongoDB needed)

## 📋 Prerequisites Check
- ✅ Node.js v24.11.1 (meets requirements: 18.20.2+ or 20.9.0+)
- ✅ Project structure ready
- ✅ Documentation created

## 🎯 Step-by-Step Setup

### Step 1: Create MongoDB Atlas Database
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/login
3. Create new project: "techpub-platform"
4. Create free cluster (M0)
5. Set up database user and whitelist IPs (0.0.0.0/0 for development)
6. Copy connection string

### Step 2: Configure Environment Files

#### Backend Environment (`payload/.env`)
```env
DATABASE_URI=mongodb+srv://your-username:your-password@cluster0.xxxxxx.mongodb.net/techpub?retryWrites=true&w=majority
PAYLOAD_SECRET=generate-a-strong-random-secret-here
PORT=5000
NODE_ENV=development
```

#### Frontend Environment (`frontend/.env.local`)
```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NODE_ENV=development
```

### Step 3: Install Dependencies

#### Backend
```bash
cd payload
npm install
```

#### Frontend
```bash
cd frontend
npm install
```

### Step 4: Run Development Servers

#### Start Backend (Terminal 1)
```bash
cd payload
npm run dev
```
- Backend: http://localhost:5000
- Admin Panel: http://localhost:5000/admin

#### Start Frontend (Terminal 2)
```bash
cd frontend
npm run dev
```
- Frontend: http://localhost:3000

### Step 5: Test Setup
1. Visit http://localhost:3000 (your frontend)
2. Visit http://localhost:5000/admin (Payload admin)
3. Create admin user in Payload admin
4. Create some test content
5. Verify content appears on frontend

## 🌐 Production Deployment

### Backend (Render)
1. Push code to GitHub
2. Connect to Render.com
3. Deploy from `payload` folder
4. Set environment variables in Render dashboard
5. Get your backend URL

### Frontend (Vercel)
1. Connect to Vercel.com
2. Deploy from `frontend` folder
3. Set `NEXT_PUBLIC_API_URL` to your Render backend URL
4. Get your frontend URL

## 📁 Important Files Created for You

| File | Purpose |
|------|---------|
| `MONGODB_SETUP.md` | Complete MongoDB Atlas setup guide |
| `LOCAL_SETUP.md` | Detailed local development instructions |
| `DEPLOYMENT.md` | Full deployment guide for Vercel & Render |
| `payload/.env.example` | Backend environment template |
| `frontend/.env.example` | Frontend environment template |

## 🔧 Troubleshooting

### Common Issues
1. **MongoDB Connection**: Check connection string, username, password
2. **Port Conflicts**: Backend uses 5000, Frontend uses 3000
3. **Node Version**: Use 18.20.2+ or 20.9.0+
4. **Environment Variables**: Ensure both .env files are created

### Quick Commands
```bash
# Check Node version
node --version

# Backend development
cd payload && npm run dev

# Frontend development  
cd frontend && npm run dev

# Install dependencies
cd payload && npm install
cd frontend && npm install
```

## 🎉 Success Indicators

### Local Development Working
- ✅ http://localhost:3000 shows your frontend
- ✅ http://localhost:5000/admin shows Payload admin
- ✅ You can create content in admin
- ✅ Content appears on frontend

### Production Deployment Working
- ✅ Vercel frontend loads without errors
- ✅ Render backend responds to API calls
- ✅ Database connection works in production
- ✅ Frontend can fetch data from production backend

## 📞 Next Steps
1. Follow the detailed guides in each markdown file
2. Set up MongoDB Atlas (15 minutes)
3. Configure environment files (5 minutes)
4. Run locally to test (10 minutes)
5. Deploy to production (30 minutes)

Your project is ready to go! 🚀