# Deploy WorkPilot — Free on Netlify (lifetime)

Everything runs from **one Netlify site**:
- **React frontend** (static)
- **Node.js API** (Netlify Functions)
- **PostgreSQL** on **Supabase free tier** (database does not expire in 30 days like Render)

**Monthly cost: $0** for personal use within free limits.

---

## 1. Create free Supabase database

1. Sign up at [supabase.com](https://supabase.com) (free).
2. **New project** → choose a name and password.
3. Go to **Project Settings → Database → Connection string → URI**.
4. Copy the **Transaction pooler** URI (port **6543**) — best for serverless/Netlify.
5. Replace `[YOUR-PASSWORD]` in the URL.

Example:
```
postgresql://postgres.xxxx:YOUR_PASSWORD@aws-0-ap-south-1.pooler.supabase.com:6543/postgres
```

Tables are created automatically on first API request (schema migration runs on cold start).

---

## 2. Push code to GitHub

```bash
cd "/Users/firoj.khan/Documents/Dev Planner Portal"
git add .
git commit -m "Add Node.js API for Netlify deployment"
git push origin main
```

---

## 3. Deploy on Netlify

1. Go to [app.netlify.com](https://app.netlify.com) → **Add new site → Import from Git**.
2. Select your repository.
3. Settings:

| Setting | Value |
|---------|--------|
| Base directory | `frontend` |
| Build command | `npm run build` |
| Publish directory | `dist` |
| Functions directory | `netlify/functions` (auto from `netlify.toml`) |

4. **Environment variables** (Site settings → Environment variables):

| Key | Value |
|-----|--------|
| `DATABASE_URL` | Your Supabase pooler URI |
| `JWT_SECRET` | Long random string (32+ characters) |
| `APP_TIMEZONE` | `Asia/Kolkata` |
| `CORS_ORIGINS` | `https://YOUR-SITE.netlify.app,http://localhost:5173` |
| `VITE_API_URL` | *(leave empty)* — API is same origin |

5. Click **Deploy**.

Your live URL: `https://YOUR-SITE.netlify.app`

---

## 4. Verify

1. Open `https://YOUR-SITE.netlify.app`
2. Health check: `https://YOUR-SITE.netlify.app/actuator/health` → `{"success":true,"data":{"status":"UP"}}`
3. Register → login → create tasks/notes

---

## Local development

```bash
cd frontend
cp .env.example .env
# Edit .env with your Supabase DATABASE_URL

npm install
npm run dev
```

- Frontend: http://localhost:5173
- API: http://localhost:3001 (proxied via Vite)

---

## Architecture

```
Netlify Site
├── dist/              React app (static)
└── functions/api      Node.js Express API

Supabase (external)
└── PostgreSQL         Free tier database
```

---

## Free tier limits

| Service | Limit |
|---------|--------|
| Netlify | 300 credits/month (hard cap, no charge) |
| Supabase DB | 500 MB, 2 projects, pauses after 1 week inactive |
| Netlify Functions | 125k requests/month on free |

Fine for personal WorkPilot use.

---

## Troubleshooting

| Issue | Fix |
|-------|-----|
| `DATABASE_URL is not configured` | Add env var in Netlify → redeploy |
| 502 on API | Check Supabase URL uses pooler port 6543 |
| CORS error | Add your Netlify URL to `CORS_ORIGINS` |
| Login works locally, not live | Redeploy after setting env vars |
| Cold start slow | Normal on free Netlify Functions (~1–3 sec first hit) |
