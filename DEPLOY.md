# Deploy: Vercel + Render + Neon

## Architecture

| App | Host | Root folder |
|-----|------|-------------|
| Marketplace frontend | Vercel | `frontend` |
| Admin panel | Vercel | `admin-panel` |
| NestJS API | Render | `backend` |
| PostgreSQL | Neon | — |

## Quick start

```powershell
.\deploy.ps1
```

Then follow steps A–F printed by the script.

## 1. GitHub

1. [Create repository](https://github.com/new) → `marketplace-app`
2. Push:

```powershell
git remote add origin https://github.com/YOUR_USER/marketplace-app.git
git push -u origin main
```

## 2. Neon (database)

1. [console.neon.tech](https://console.neon.tech) → New Project
2. Region: **Frankfurt**
3. Copy **Pooled connection** → `DATABASE_URL`

## 3. Render (backend)

### Option A — Blueprint (recommended)

1. [dashboard.render.com/blueprints](https://dashboard.render.com/blueprints)
2. **New Blueprint Instance** → connect GitHub repo
3. Render reads `render.yaml` automatically
4. Set secrets in dashboard:
   - `DATABASE_URL` = from Neon
   - `ALLOWED_ORIGINS` = `https://your-frontend.vercel.app,https://your-admin.vercel.app`

### Option B — Manual Web Service

| Setting | Value |
|---------|-------|
| Root Directory | `backend` |
| Build | `npm install && npm run build` |
| Start | `npm run start:prod` |

Environment variables:

```
NODE_ENV=production
PORT=3001
DB_TYPE=postgres
DATABASE_URL=postgresql://...
JWT_SECRET=long-random-secret
JWT_EXPIRES_IN=7d
ALLOWED_ORIGINS=https://your-frontend.vercel.app,https://your-admin.vercel.app
```

Test: `https://YOUR-API.onrender.com/api/categories`

## 4. Vercel — Frontend

1. [vercel.com/new](https://vercel.com/new) → Import GitHub repo
2. **Root Directory**: `frontend`
3. Environment variables:

```
NEXT_PUBLIC_API_URL=https://YOUR-API.onrender.com/api
NEXT_PUBLIC_WS_URL=https://YOUR-API.onrender.com
```

4. Deploy

## 5. Vercel — Admin Panel

1. [vercel.com/new](https://vercel.com/new) → same repo, **new project**
2. **Root Directory**: `admin-panel`
3. Environment:

```
NEXT_PUBLIC_API_URL=https://YOUR-API.onrender.com/api
```

4. Deploy

## 6. Seed production database

From your PC (once):

```powershell
cd backend
$env:DB_TYPE="postgres"
$env:DATABASE_URL="postgresql://..."
npm run seed
```

Demo logins after seed:
- Buyer: `buyer@marketplace.com` / `password123`
- Admin: `admin@marketplace.com` / `password123`

## 7. Update CORS after Vercel deploy

In Render → Environment → set `ALLOWED_ORIGINS` to both Vercel URLs, then redeploy.

## Links

- [Vercel Docs](https://vercel.com/docs)
- [Render Docs](https://render.com/docs)
- [Neon Docs](https://neon.tech/docs)
