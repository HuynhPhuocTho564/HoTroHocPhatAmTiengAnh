---
name: deployment
description: Use when setting up the development environment, deploying Web_HoTroPhatAmEN, configuring Docker, writing deployment scripts, creating .env files, or preparing the project for demo/thesis defense. Also use when writing installation guides or troubleshooting environment issues.
---

# Deployment & Environment Setup

## Purpose

Guide environment setup, Docker configuration, and deployment preparation for the pronunciation learning app. This project is a thesis project — the deployment guide must be simple enough for a reviewer to run the app locally.

## Required Context

- Read `PLAN/01_Roadmap/ACTION_PLAN_NEXT_STEPS.md` to understand the current project state.
- Read `english_pronunciation_app/frontend/.env.example` for required environment variables.
- Read `english_pronunciation_app/backend/.env.example` for backend environment variables.

---

## 1. Architecture Overview

```
┌─────────────────────────────────┐
│         Frontend (Next.js)     │
│  Port 3000                     │
│  - React pages & components     │
│  - API Routes (BFF layer)      │
│  - Prisma Client (DB access)   │
│  - NextAuth (authentication)   │
└──────────────┬──────────────────┘
               │
┌──────────────▼──────────────────┐
│      PostgreSQL Database        │
│  Port 5432                     │
│  - User data, exercises, scores │
│  - IPA content, question bank  │
│  - Gamification data           │
└────────────────────────────────┘

┌─────────────────────────────────┐
│       Backend (FastAPI)         │
│  Port 8000                     │
│  - Health check only (MVP)     │
│  - CORS for frontend           │
│  - Future: AI pronunciation    │
└────────────────────────────────┘
```

**Key insight:** All real API logic lives in Next.js API Routes. FastAPI is a minimal stub for future AI features.

---

## 2. Local Development Setup

### Prerequisites

- Node.js 18+ (recommended: 20 LTS)
- PostgreSQL 15+
- Python 3.10+ (only if running FastAPI backend)
- npm or pnpm

### Step-by-Step

```powershell
# 1. Clone and enter project
git clone <repo-url>
cd english_pronunciation_app

# 2. Frontend setup
cd frontend
cp .env.example .env
# Edit .env — set DATABASE_URL and AUTH_SECRET
npm install

# 3. Database setup
npx prisma generate
npx prisma db push

# 4. Seed data
npm run seed          # Basic demo data
npm run seed:lessons  # IPA lesson content (when available)

# 5. Start development server
npm run dev
# App available at http://localhost:3000

# 6. Backend (optional for MVP)
cd ../backend
python -m venv venv
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

### Environment Variables

**Frontend `.env` (required):**

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"

# Auth
AUTH_SECRET="random-secret-at-least-32-chars"
AUTH_URL="http://localhost:3000"

# Google OAuth (optional — conditional feature)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

**Backend `.env` (optional for MVP):**

```env
APP_NAME="Pronunciation App Backend"
DATABASE_URL="postgresql://user:password@localhost:5432/dbname"
CORS_ORIGINS="http://localhost:3000"
```

---

## 3. Docker Setup

### Frontend Dockerfile

```dockerfile
# english_pronunciation_app/frontend/Dockerfile
FROM node:20-alpine AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --only=production

# Build
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npx prisma generate
RUN npm run build

# Production
FROM base AS runner
WORKDIR /app
ENV NODE_ENV=production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma

EXPOSE 3000
CMD ["node", "server.js"]
```

### Backend Dockerfile

```dockerfile
# english_pronunciation_app/backend/Dockerfile
FROM python:3.12-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
```

### Docker Compose

```yaml
# english_pronunciation_app/docker-compose.yml
version: "3.8"

services:
  db:
    image: postgres:15-alpine
    environment:
      POSTGRES_USER: pronunc
      POSTGRES_PASSWORD: pronunc123
      POSTGRES_DB: pronunciation_app
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  frontend:
    build:
      context: ./frontend
      dockerfile: Dockerfile
    ports:
      - "3000:3000"
    environment:
      DATABASE_URL: postgresql://pronunc:pronunc123@db:5432/pronunciation_app
      AUTH_SECRET: ${AUTH_SECRET}
      AUTH_URL: http://localhost:3000
    depends_on:
      - db

  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile
    ports:
      - "8000:8000"
    environment:
      DATABASE_URL: postgresql://pronunc:pronunc123@db:5432/pronunciation_app
      CORS_ORIGINS: http://localhost:3000
    depends_on:
      - db

volumes:
  pgdata:
```

### Docker Commands

```powershell
# Start all services
docker-compose up --build

# Stop all services
docker-compose down

# Stop and remove volumes (fresh database)
docker-compose down -v

# View logs
docker-compose logs -f frontend
```

---

## 4. Database Migration Strategy

This project uses `prisma db push` for development (fast prototyping). For production/demo:

```powershell
# Development (auto-sync schema)
npx prisma db push

# If switching to migration-based (production-ready)
npx prisma migrate dev --name initial
npx prisma migrate deploy
```

**Rule:** Never run `prisma migrate reset` in a shared/production environment — it drops all data.

---

## 5. Demo Preparation (Thesis Defense)

### Pre-demo Checklist

- [ ] Database seeded with demo data (users, exercises, IPA content).
- [ ] At least 1 admin account and 2 student accounts created.
- [ ] Student accounts have some completed exercises for dashboard data.
- [ ] All pages load without errors at `http://localhost:3000`.
- [ ] Exercise submit flow works end-to-end (record → score → XP → badge).
- [ ] Leaderboard has data (at least 3 users with scores).
- [ ] Learning Map shows 4 topics with at least 2 having ACTIVE exercises.
- [ ] Dark/light mode toggle works.
- [ ] No `console.error` in browser dev tools.
- [ ] `npm run build` succeeds without warnings.

### Demo User Accounts (for seed)

```typescript
// Recommended demo accounts
const DEMO_USERS = [
  { email: "admin@test.com", name: "Admin", role: "ADMIN", password: "admin123" },
  { email: "student1@test.com", name: "Minh", role: "USER", password: "student123" },
  { email: "student2@test.com", name: "Lan", role: "USER", password: "student123" },
];
```

### Quick Start for Reviewer

Include in README or handoff document:

```powershell
# 1. Install Node.js 20+ and PostgreSQL 15+
# 2. Create database
createdb pronunciation_app

# 3. Setup
cd english_pronunciation_app/frontend
cp .env.example .env
# Edit .env: DATABASE_URL, AUTH_SECRET

# 4. Install & seed
npm install
npx prisma db push
npm run seed

# 5. Run
npm run dev
# Open http://localhost:3000
# Login: admin@test.com / admin123
```

---

## 6. Troubleshooting

| Issue | Solution |
|-------|----------|
| `prisma generate` fails | Delete `node_modules/.prisma` and retry |
| `npm run build` fails on Prisma | Run `npx prisma generate` first |
| Database connection refused | Check PostgreSQL is running, verify DATABASE_URL |
| Auth error after seed | Ensure AUTH_SECRET is set and at least 32 chars |
| Web Speech API not working | Use Chrome or Edge (not Firefox/Safari) |
| Docker build fails | Check Node.js version in Dockerfile matches package.json engines |
| Port 3000 already in use | Change port: `npm run dev -- -p 3001` |
| FastAPI CORS errors | Verify CORS_ORIGINS includes frontend URL |

---

## 7. Production Considerations (Post-Thesis)

These are NOT needed for thesis demo but noted for future reference:

- Add `output: 'standalone'` to `next.config.mjs` for optimized Docker builds.
- Use managed PostgreSQL (Supabase, Railway, Neon) instead of local.
- Add rate limiting to API routes.
- Set up SSL/TLS (required for Web Speech API on non-localhost).
- Add health check endpoint monitoring.
- Set up automated backups for PostgreSQL.
