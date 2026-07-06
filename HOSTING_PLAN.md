# TechPub Platform — Hosting & Infrastructure Plan

**Date:** June 2025  
**Budget Target:** < $15/month  
**Current Stack:** Vercel (frontend) + Render (backend) + MongoDB Atlas (DB) + No image storage  
**Domain:** ✅ Already owned

---

## Executive Summary

Your current stack works but has scaling constraints:
- **Render free tier:** 30-60s cold starts (backend spins down after 15min inactivity)
- **Vercel Hobby (free):** Limited bandwidth, 6,000 build minutes/month
- **MongoDB Atlas M0 (free):** 512MB storage limit, 100 ops/sec, no backups
- **No image storage:** Images stored in MongoDB or served from GitHub

**Recommendation:** Move to a **Hybrid PaaS + VPS model** for $12-15/month with:
- **Frontend:** Keep Vercel (best developer experience, zero config)
- **Backend:** Migrate to Render paid ($7/month starter) OR Fly.io ($2-5/month)
- **Database:** MongoDB Atlas M2 ($9/month, 2GB storage)
- **Images:** Cloudflare R2 ($0.50-2/month, free egress)

---

## Current Stack Analysis

| Component | Current | Cost | Issues |
|-----------|---------|------|--------|
| **Frontend** | Vercel Hobby | $0 | 100GB bandwidth limit, 6k build min/month |
| **Backend** | Render Free | $0 | 30-60s cold starts, spins down after 15min |
| **Database** | MongoDB M0 | $0 | 512MB limit, no backups, 100 ops/sec |
| **Images** | None | $0 | Not handled; bloat if stored in DB |
| **Total** | — | **$0** | Production-unsuitable |

---

## Option A: Vercel + Render Paid (Recommended for Now)

**Best for:** Teams preferring managed platforms; ease of deployment.

| Component | Service | Tier | Cost | Notes |
|-----------|---------|------|------|-------|
| Frontend | Vercel | Pro | $0* | Free tier sufficient for dev; upgrade later if needed |
| Backend | Render | Starter | $7 | Always-on, no cold starts, auto-deploys from Git |
| Database | MongoDB Atlas | M2 | $9 | 2GB storage, 10 concurrent connections, daily backups |
| Images | Cloudflare R2 | Free+Paid | $1-2 | 10GB free/month, $0.015/GB after, **zero egress** |
| DNS/CDN | Cloudflare | Free | $0 | Included with domain |
| **Total** | — | — | **$17-18/month** | **Over budget by $2-3** |

**How to reduce to <$15:**
1. Keep MongoDB M0 free for now (512MB is tight but workable for MVP)
2. Reduce Render to $7/month starter (scales to $25 if needed)
3. Use free Cloudflare R2 tier (10GB/month) + cheap Backblaze B2 if needed
4. **Total: $7 (Render) + $0 (MongoDB free) + $0 (R2 free) = $7/month**

---

## Option B: Full VPS + Self-Hosted (Most Budget-Friendly)

**Best for:** Full control, learning DevOps, scaling predictably.

| Component | Service | Spec | Cost | Notes |
|-----------|---------|------|------|-------|
| **VPS Host** | Hetzner CX11 | 1 vCPU, 1GB RAM, 25GB SSD | $3.99 | Reliable, Asia-optimized IPs available |
| **OR** | Hostinger Cloud | 1 vCPU, 1GB RAM, 50GB SSD | $2.99 | Budget option; slower support |
| **OR** | Fly.io | Shared CPU-1x, 256MB RAM | $2.02 | Built for containers, easiest deployment |
| Database | Self-hosted MongoDB | On VPS | $0 | Runs on same VPS, eats 200-300MB RAM |
| Frontend | Vercel | Hobby | $0 | Still deploy here (best UX) |
| Images | Cloudflare R2 free tier | — | $0 | 10GB/month free |
| **Total** | — | — | **$3.99-5/month** | **Well under budget** |

**Trade-offs:**
- ✅ Cheapest option
- ✅ No cold starts, full Node.js APIs
- ✅ Unlimited bandwidth (Hetzner/Hostinger)
- ❌ You manage OS updates, backups, security
- ❌ 1GB RAM is tight; struggle at scale
- ⚠️ No managed backups (DIY or use backup service)

**Recommended VPS Setup:**
```
Hetzner CX11 ($3.99/month)
├── Node.js (Payload backend)
├── MongoDB (self-hosted, use monthly backups to S3/R2)
├── Nginx reverse proxy
└── Let's Encrypt SSL (free, auto-renew)
```

Deploy with **Coolify** (open-source PaaS on your VPS):
- One-click deployments from Git
- Automatic SSL certificates
- Built-in backups, health checks
- Easier than manual Docker/systemd
- **Coolify cost: FREE** (self-hosted)

---

## Option C: Hybrid Smart Mix (Best Balance)

**Best for:** Production-ready, staying under budget, growth runway.

| Component | Service | Tier | Cost | Why |
|-----------|---------|------|------|-----|
| **Frontend** | Vercel | Hobby | $0 | Zero-config, instant deploys, caching |
| **Backend** | Fly.io | Starter | $2-5 | $5/month free allowance, scale as needed |
| **Database** | MongoDB Atlas | M0 | $0 | Free tier (512MB); upgrade to M2 ($9) if needed |
| **Images** | Cloudflare R2 | Free | $0 | 10GB/month free, zero egress, CDN included |
| **Backups** | R2 or AWS Glacier | — | $1 | Optional: database snapshots to R2 weekly |
| **Monitoring** | UptimeRobot | Free | $0 | Pings backend every 5min, alerts on downtime |
| **Total** | — | — | **$1-7/month** | Scales up gracefully |

**Scaling path:**
1. Start: Fly.io $0 (within free allowance) + MongoDB M0
2. 100K posts: Upgrade to Fly.io $5/month + MongoDB M2 ($9) = $14/month
3. 1M posts: Add dedicated MongoDB ($50+) but Fly.io scales horizontally

---

## Detailed Cost Breakdown: Option A vs B vs C

### Option A: Vercel + Render Paid
```
Vercel Pro:           $0 (Hobby)
Render Starter:       $7
MongoDB M2:           $9
Cloudflare R2:        $1
───────────────────────────
TOTAL:               $17/month
```
❌ **Over budget. Downgrade to Option C.**

### Option B: Hetzner VPS + Self-Hosted
```
Hetzner CX11:         $3.99
Vercel Hobby:         $0
Cloudflare R2 free:   $0
Coolify (on VPS):     $0
───────────────────────────
TOTAL:               $3.99/month
```
✅ **Best budget.** Requires DevOps knowledge.

### Option C: Hybrid (Recommended)
```
Vercel Hobby:         $0
Fly.io (free tier):   $0 (+ scale as needed)
MongoDB M0:           $0
Cloudflare R2 free:   $0
Optional backups:     $1
───────────────────────────
TOTAL:               $0-1/month (scales to $15 as traffic grows)
```
✅ **Best balance of cost, ease, and scalability.**

---

## Image Storage Comparison

| Service | Storage Cost | Egress | Free Tier | Best For |
|---------|--------------|--------|-----------|----------|
| **Cloudflare R2** | $0.015/GB-month | **FREE** | 10GB/month | ✅ Best choice |
| **Backblaze B2** | $6/TB/month | $0.01/GB after 1x storage | Unlimited free API | Backup archive |
| **AWS S3** | $0.023/GB-month | $0.09/GB | None | Enterprise (overkill) |
| **Uploadcare** | $0 | FREE up to 100 files | 3GB total | Simple uploads |

**Winner: Cloudflare R2**
- Free egress (save 10x on bandwidth)
- 10GB free tier covers ~100 images
- Integrated with Cloudflare CDN (instant caching)
- Payload CMS has R2 plugins

---

## Database Options Deep Dive

| Option | Storage | Cost | Backups | Best For |
|--------|---------|------|---------|----------|
| **MongoDB M0** | 512MB | FREE | None | Dev only (risk!) |
| **MongoDB M2** | 2GB | $9 | Daily | Production MVP |
| **MongoDB M5** | 5GB | $25 | Daily | Growing |
| **Self-hosted** | Unlimited | $4 VPS | DIY | Full control, learning |
| **Firebase** | Unlimited | $1-25 | Built-in | No SQL/Aggregation |

**Recommendation:**
1. **For MVP:** Use MongoDB M0 (free, 512MB)
   - ⚠️ Risk: No backups, hitting 512MB = locked account
   - Mitigation: Export weekly to R2 backup bucket (free)

2. **For Production (recommended):** Upgrade to M2 ($9/month)
   - ✅ Daily auto-backups, point-in-time recovery
   - ✅ 2GB storage (grows as needed)
   - ✅ Premium support

---

## Recommended Stack: Option C

### Architecture
```
┌─────────────────────────────────────┐
│   Vercel (Frontend)                 │
│   ├─ Next.js app                    │
│   ├─ Auto-deploy from Git           │
│   └─ Global CDN + caching           │
└─────────────────┬───────────────────┘
                  │ API calls
┌─────────────────▼───────────────────┐
│   Fly.io (Backend)                  │
│   ├─ Payload CMS Node.js            │
│   ├─ $5/month free allowance        │
│   ├─ Always-on (no cold starts)     │
│   └─ Scale to 3 regions if needed   │
└─────────────────┬───────────────────┘
                  │
      ┌───────────┴───────────┬─────────────┐
      │                       │             │
┌─────▼──────┐    ┌───────────▼──┐   ┌─────▼──────┐
│ MongoDB M0 │    │ Cloudflare   │   │ UptimeRobot│
│ (free)     │    │ R2 (free 10GB)   │ (free)     │
│ 512MB      │    │ + CDN        │   │ Monitoring │
└────────────┘    └──────────────┘   └────────────┘
```

### Cost Breakdown
- **Vercel:** $0 (Hobby tier)
- **Fly.io:** $0-5 (within free allowance, $0.02/GB egress after)
- **MongoDB:** $0 (M0 free tier)
- **Cloudflare R2:** $0 (10GB/month free)
- **Monitoring:** $0 (UptimeRobot free)
- **Total: $0-5/month** ✅

### Deployment Steps

#### 1. Migrate Backend to Fly.io
```bash
# Install Fly CLI
curl https://fly.io/install.sh | sh

# Deploy Payload from git
fly launch --dockerfile Dockerfile.payload

# Connect to MongoDB Atlas M0
fly secrets set DATABASE_URL=mongodb+srv://...
```

#### 2. Set Up Image Storage (R2)
```bash
# In Payload config:
import { S3Client } from '@payloadcms/plugin-cloud-storage/s3'

plugins: [
  cloudStoragePlugin({
    collections: {
      'media': {
        adapter: S3Client({
          config: {
            credentials: {
              accessKeyId: process.env.R2_ACCESS_KEY,
              secretAccessKey: process.env.R2_SECRET_KEY,
            },
            region: 'auto',
            endpoint: 'https://<account-id>.r2.cloudflarestorage.com',
          },
          bucket: 'techpub-images',
        }),
      },
    },
  }),
]
```

#### 3. Weekly Database Backups (Automation)
```bash
# Cron job on Fly.io to dump MongoDB → R2
# Run: mongodump → gzip → upload to R2 → keep 4 weekly backups
# Cost: Free (within R2 1M write operations/month)
```

---

## VPS Alternative: If You Want Full Control

### Setup: Hetzner CX11 + Coolify ($3.99/month)

1. **Rent VPS:** Hetzner CX11 ($3.99/month)
   - 1 vCPU, 1GB RAM, 25GB SSD
   - Login via SSH

2. **Install Coolify:**
   ```bash
   curl -sSL https://get.coollify.io | bash
   ```

3. **Deploy stack:**
   - Connect GitHub repo
   - Coolify auto-deploys Node.js + MongoDB on same VPS
   - Auto-SSL with Let's Encrypt
   - Built-in health checks

4. **Backups:**
   ```bash
   # Scheduled backup to R2 (weekly)
   # Cost: $0 (within R2 free tier operations)
   ```

**Total: $3.99/month** ✅  
**Trade-off:** You handle OS updates, security patches (more learning).

---

## Migration Checklist

### Phase 1: Add Image Storage (Today)
- [ ] Create Cloudflare R2 bucket (free tier)
- [ ] Get API credentials
- [ ] Test upload via Payload CMS
- [ ] Redirect existing images to R2 CDN

### Phase 2: Upgrade Database (This Month)
- [ ] Decide: Keep M0 free (risky) OR upgrade to M2 ($9)
- [ ] If keeping M0: Set up weekly backup script to R2
- [ ] Test restore procedure

### Phase 3: Migrate Backend (This Month)
- [ ] Create Fly.io account (free tier)
- [ ] Deploy Payload to Fly.io
- [ ] Connect to same MongoDB Atlas
- [ ] Test all APIs work
- [ ] Gradually shift traffic (keep Render as fallback)

### Phase 4: Monitor & Optimize (Ongoing)
- [ ] Set up UptimeRobot (free) to monitor Fly.io
- [ ] Track bandwidth & database usage
- [ ] Upgrade tiers if needed (MongoDB M2 at 1GB usage, Fly.io scale at 5GB bandwidth)

---

## Cost Scenarios: 12-Month Projection

### Scenario A: Stay on Current (Render Free)
```
Months 1-6:  $0/month
             ↓ (hits limits, poor performance)
Months 7-12: Forced to upgrade to Render $7 = $42 total
             
TOTAL YEAR:  $42
```
❌ Poor UX, sudden cost spike.

### Scenario B: Hybrid Option C (Recommended)
```
Months 1-6:  $0/month (within free tiers)
Months 7-9:  MongoDB free → M2 ($9) = $27
Months 10-12: Fly.io $5/month = $15
             
TOTAL YEAR:  $42 (similar to A, but with 3x capacity)
```
✅ Smooth growth, predictable costs.

### Scenario C: VPS Full Self-Hosted
```
Every month: $3.99 (Hetzner) + $0 (R2)
             
TOTAL YEAR:  $47.88
```
✅ Cheapest long-term, requires DevOps work.

---

## Recommendation Summary

| Use Case | Best Option | Cost | Effort |
|----------|-------------|------|--------|
| **MVP, launching now** | Option C (Fly.io + M0) | $0-5/month | Low (managed PaaS) |
| **Production, customer revenue** | Option C (Fly.io + M2) | $9-14/month | Low |
| **Full control, learning DevOps** | Option B (Hetzner + Coolify) | $3.99/month | High (manage VPS) |
| **Enterprise, 1M+ users** | Vercel Pro + Render Standard + RDS | $100+/month | Medium (managed) |

### 🎯 **Go with Option C for now:**
1. Keep Vercel frontend (no change)
2. Migrate Payload backend to Fly.io ($0-5/month)
3. Keep MongoDB M0 free tier with weekly R2 backups
4. Upgrade MongoDB to M2 ($9/month) when you hit 400MB usage
5. **Total: $9-14/month for production-ready stack**

---

## Next Steps

1. **This week:**
   - Create Fly.io account (https://fly.io)
   - Create R2 bucket (https://dash.cloudflare.com/r2)
   - Test image uploads to R2

2. **Next week:**
   - Deploy Payload to Fly.io
   - Migrate MongoDB connection
   - Run parallel with Render for 1 week

3. **Week 3:**
   - Deprecate Render free tier
   - Monitor Fly.io performance
   - Set up backups

4. **Month 2:**
   - Evaluate actual costs vs. budget
   - Plan database upgrade to M2 if needed

---

## Support Links

- **Vercel:** https://vercel.com/docs
- **Fly.io:** https://fly.io/docs/getting-started/
- **MongoDB Atlas:** https://www.mongodb.com/docs/atlas/
- **Cloudflare R2:** https://developers.cloudflare.com/r2/
- **Coolify (VPS alt):** https://coolify.io/docs
- **Payload CMS Storage:** https://payloadcms.com/docs/plugins/cloud-storage

---

**Questions? Issues with this plan?**
- Fly.io vs Render: Fly.io is $2-5/month cheaper, faster deployments, no cold starts
- MongoDB M0 risk: Only 512MB; backup weekly to R2 (automatic via script)
- Image egress costs: Cloudflare R2 has **zero egress** — saves 10x vs AWS S3

