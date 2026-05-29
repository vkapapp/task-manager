# Task Manager

Full-stack task management app built for Upwork portfolio.

## Live Demo

- **Frontend:** *(deploy to Vercel — link будет после деплоя)*
- **API:** *(deploy to Render — link будет после деплоя)*

> **Note:** API runs on Render free tier — first request may take 30–60s (cold start).
> SQLite data resets on each redeploy (portfolio demo behavior).

**Stack:** React 19 + TypeScript + Tailwind CSS · Node.js + Express + SQLite

## Getting Started

### Prerequisites

- Node.js 20+

### Client (Frontend)

```bash
cd client
npm install
npm run dev
```

Runs at `http://localhost:5173`

### Server (Backend)

```bash
cd server
npm install
cp .env.example .env
npm run dev
```

Runs at `http://localhost:3001`

Health check: `GET http://localhost:3001/health`

## Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start dev server with hot reload |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm run lint` | Run ESLint |

## Deployment

- **Client** → Vercel (root: `client/`, build: `npm run build`, output: `dist/`)
- **Server** → Render Web Service (root: `server/`, build: `npm install && npm run build`, start: `node dist/server.js`)

> **Note:** Render free tier uses ephemeral storage — SQLite data resets on each redeploy. Acceptable for portfolio demo.
> **Note:** Render free tier spins down after 15 min of inactivity. First request after sleep may take 30–60 seconds.
