# techpub-platform

This repository contains a production-ready plan and guide for building the TechPub platform (based on the provided Figma prototype).

Figma prototype: https://www.figma.com/proto/aN0tZp9ej6GOyutdYewtHE/techpub-Practo-Redesign?page-id=9%3A2&node-id=2016-41&viewport=-1799%2C702%2C0.27&t=wAuqBz0ZEJMTFUyj-1&scaling=scale-down-width&content-scaling=fixed

**Purpose**: capture what you're building, the stack, repo layout, local development steps, how to use MongoDB Atlas (so you don't need to install MongoDB locally), and deployment instructions for frontend and backend (Vercel + Render / Railway / Payload Cloud). This README is a single reference to get the project from zero → running locally → deployed to production.

**Key Links**
- **Figma**: https://www.figma.com/proto/aN0tZp9ej6GOyutdYewtHE/techpub-Practo-Redesign

**Short Tech Summary**
- **Frontend**: Next.js 14 (App Router), TypeScript, TailwindCSS, React components
- **Backend / CMS**: Payload CMS (Node.js, TypeScript), headless
- **Database**: MongoDB Atlas (cloud) — use same cloud DB for local & production (no local MongoDB required)
- **Hosting**: Frontend on Vercel; Backend on Render (or Railway / Payload Cloud); Database on MongoDB Atlas
- **CI / Repo**: GitHub (this repository)

**Monorepo layout (this repo)**
```
techpub-platform/
	README.md
	frontend/        # Next.js app
		package.json
		app/
		public/
		tsconfig.json
	payload/         # Payload CMS backend
		package.json
		src/
		payload.config.ts
		tsconfig.json
	tests/           # integration / e2e tests
```

**Naming & conventions**
- **Repo name**: `techpub-platform` (this repo)
- **Frontend folder**: `frontend`
- **Backend folder**: `payload` (existing in repo)
- Use `main` as the default production branch. Use feature branches for work (e.g., `feature/posts-page`).

**Environment variables (examples)**
- `backend/.env` (local development for Payload CMS):
```
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/techpub?retryWrites=true&w=majority
PAYLOAD_SECRET=local_dev_secret_change_me
PORT=5000
```
- `frontend/.env.local` (local Next.js):
```
NEXT_PUBLIC_API_URL=http://localhost:5000
```
- Production (on Render / Vercel) — set equivalent ENV variables in each hosting platform's dashboard; do not commit secrets.

How MongoDB works here:
- You do NOT need to install MongoDB locally. Create a free MongoDB Atlas cluster and use that connection string. Both your local Payload CMS and deployed Payload instance will use that cloud DB.

Getting started — Local dev (Windows PowerShell)
1. Clone repo
```powershell
git clone https://github.com/<your-username>/techpub-platform.git
cd techpub-platform
```
2. Start backend (Payload)
```powershell
cd payload
# install dependencies
npm install
# create .env (see example above)
# run dev server
npm run dev
# admin UI will be at http://localhost:5000/admin
```
3. Start frontend (Next.js)
```powershell
cd ../frontend
npm install
# create .env.local (see above)
npm run dev
# Next.js will run at http://localhost:3000
```

Connecting frontend → backend
- Frontend fetches data from `NEXT_PUBLIC_API_URL` (set to your local or production backend URL). Example fetch in Next.js:
```
const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/posts`);
const posts = await res.json();
```

Tests
- Unit tests / integration tests: refer to `payload/tests` and `frontend` test configs. Run the test runners listed in each package.json. Example:
```powershell
# run backend tests (if configured)
cd payload
npm run test

# run frontend tests
cd ../frontend
npm run test
```

Deployment (recommended)
1) MongoDB Atlas (single DB for local & prod)
- Create a free cluster at https://www.mongodb.com/cloud/atlas
- Create DB user with password; allow access from your IPs (or 0.0.0.0/0 for testing) and copy the connection string.

2) Deploy Payload CMS (backend) — Render (recommended)
- Create a new Web Service on Render and connect to this repo.
- Set the service root or build directory to the `payload` folder.
- Build command: `npm install` (or `pnpm install` if using pnpm)
- Start command: `npm run start` (match script in `payload/package.json`)
- Environment variables (Render dashboard):
	- `MONGODB_URI` = your Atlas URI
	- `PAYLOAD_SECRET` = production secret
	- `PORT` = `5000`
- Render will provide a public URL like `https://techpub-backend.onrender.com`.

3) Deploy Next.js (frontend) — Vercel
- Import `frontend` folder into Vercel (connect GitHub repo, select `frontend` path)
- Set environment variable `NEXT_PUBLIC_API_URL` to your Render backend URL.
- Vercel will handle builds; the site will be deployed on a Vercel URL or your custom domain.

Alternative backend hosts: Railway, Heroku, Payload Cloud. Steps are similar: point the service to the `payload` folder, add env vars, and start.

CI / GitHub workflow (recommended)
- Add a simple GitHub Actions workflow to run tests on push and deploy previews on PRs. Example files can be added later on request.

How to push code and keep branches
- Create feature branch:
```powershell
git checkout -b feature/<short-description>
```
- Commit changes and push:
```powershell
git add .
git commit -m "feat: add posts collection"
git push origin feature/<short-description>
```
- Open a PR from the branch to `main` and use the CI checks.

Production readiness checklist
- Use strong `PAYLOAD_SECRET` (rotate if leaked)
- Use Atlas backup / project-level backups
- Configure CORS only to required origins
- Use HTTPS (Vercel / Render provide it)
- Configure appropriate roles in Payload (Admin, Editor)
- Add logging and monitoring

Figma & UI notes
- The Figma prototype shows the app layout and components. Use it as a visual spec for the Next.js pages and shared components.
- Suggested page breakdown: home, posts list, post detail, categories, tags, author pages, admin pages (via Payload).

Next steps I can do for you
- Generate base scaffolding for `frontend` and `payload` matching the Figma pages.
- Create Payload collections (`Users`, `Posts`, `Categories`, `Tags`, `Subscribers`), and a sample `payload.config.ts`.
- Add example Next.js pages that fetch from Payload API.
- Add GitHub Actions workflows for tests and previews.

If you want me to scaffold the project (code + configs), reply with: `Yes scaffold` and say whether you prefer `npm` or `pnpm` for package management. I'll then generate the files directly in this repo.

---

Maintainers: add your name and contact information below.

Owner: <your-name> — GitHub: https://github.com/<your-username>

