# WorkPilot

**Plan. Organize. Execute.**

WorkPilot is a full-stack productivity application for tasks, notes, and knowledge management.

## Architecture

```
React (Netlify) → Node.js API (Netlify Functions) → Supabase PostgreSQL (free)
```

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 19, Vite 6, Mantine, React Router, Axios, SCSS |
| Backend | Node.js, Express, JWT, Zod, PostgreSQL (`pg`) |
| Database | Supabase PostgreSQL (free tier) |
| Deploy | **Netlify** (frontend + API functions) — see `frontend/DEPLOY-NETLIFY.md` |

## Quick Start (Local)

### 1. Environment

```bash
cd frontend
cp .env.example .env
```

Set `DATABASE_URL` to your [Supabase](https://supabase.com) pooler URI (or local Postgres — see below).

### 2. Run

```bash
npm install
npm run dev
```

- App: http://localhost:5173  
- API: http://localhost:3001 (proxied via Vite)

### Optional: local PostgreSQL

```bash
docker compose up -d
```

Then set in `frontend/.env`:

```
DATABASE_URL=postgresql://workpilot:workpilot@localhost:5432/workpilot
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/v1/auth/register` | Register |
| POST | `/api/v1/auth/login` | Login |
| GET | `/api/v1/dashboard` | Dashboard stats |
| GET/POST/PUT/DELETE | `/api/v1/tasks` | Planner tasks |
| GET/POST/PUT/DELETE | `/api/v1/notes` | Notes |
| GET/POST/PUT/DELETE | `/api/v1/knowledge` | Knowledge wiki |
| GET | `/api/v1/users/me` | Profile |

## Deploy (Free — Netlify + Supabase)

Full step-by-step guide: **`frontend/DEPLOY-NETLIFY.md`**

1. Create free [Supabase](https://supabase.com) PostgreSQL database
2. Push repo to GitHub
3. Connect repo in [Netlify](https://app.netlify.com) — base directory: `frontend`
4. Set env vars: `DATABASE_URL`, `JWT_SECRET` (leave `VITE_API_URL` empty)
5. Deploy → live at `https://your-site.netlify.app`

**Cost: $0/month** for personal use.

## Environment Variables

**Local** (`frontend/.env`):

```
DATABASE_URL=postgresql://...
JWT_SECRET=your-secret-min-32-chars
VITE_API_URL=
```

**Netlify** (Site → Environment variables): same keys; leave `VITE_API_URL` empty for same-origin API.

## Build & Verify

```bash
cd frontend && npm run build
```
