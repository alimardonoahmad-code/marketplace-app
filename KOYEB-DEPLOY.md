# Deploy: Koyeb + Vercel + Neon (step by step)

## Step 1 — Neon (database)
https://console.neon.tech → New Project → Copy DATABASE_URL (Pooled)

## Step 2 — Koyeb (backend)
https://app.koyeb.com → Web Service → GitHub repo → Dockerfile in `backend/`

Env:
- NODE_ENV=production
- DB_TYPE=postgres
- DATABASE_URL=<from Neon>
- JWT_SECRET=<random long string>
- JWT_EXPIRES_IN=7d
- ALLOWED_ORIGINS=https://placeholder.vercel.app

## Step 3 — Seed database
```powershell
cd backend
$env:DB_TYPE="postgres"
$env:DATABASE_URL="<neon url>"
npm run seed
```

## Step 4 — Vercel frontend
https://vercel.com/new → root: `frontend`
- NEXT_PUBLIC_API_URL=https://YOUR-APP.koyeb.app/api
- NEXT_PUBLIC_WS_URL=https://YOUR-APP.koyeb.app

## Step 5 — Vercel admin
https://vercel.com/new → root: `admin-panel`
- NEXT_PUBLIC_API_URL=https://YOUR-APP.koyeb.app/api

## Step 6 — CORS
Koyeb → ALLOWED_ORIGINS = both Vercel URLs → redeploy
