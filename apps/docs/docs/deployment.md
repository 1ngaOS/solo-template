# Deployment

This guide covers deployment options for the Solo Monorepo Template.

## Frontend: SSR only (no static build)

The frontend is **always** a Server-Side Rendered (SSR) app. It uses **`@sveltejs/adapter-node`** and runs as a Node server in production. Do **not** use `@sveltejs/adapter-static` or deploy the frontend as a static site.

- **Build**: `pnpm frontend build` produces a Node app in `apps/frontend/build/`.
- **Run**: On the VM, the frontend is started with `node serve.mjs` (from the deploy directory). `serve.mjs` loads `.env` and runs `build/index.js`.

### Frontend proxies to backend

The frontend never calls the backend by its own URL from the client. All API access goes through the same origin:

- **Server-side**: `hooks.server.ts` rewrites `fetch('/api/...')` to the backend using `BACKEND_API_URL` / `PUBLIC_API_URL`.
- **Client-side**: The browser requests `/api/...` on the frontend; `src/routes/api/[...path]/+server.ts` proxies to the backend.

Set `BACKEND_API_URL` or `PUBLIC_API_URL` per environment (staging/production) so each frontend instance talks to the correct backend.

## VM deployment (systemd, two envs per app)

CI/CD deploys to a VM with **two environments** per app: **staging** and **production**.

| Branch | Environment | Paths on VM |
|--------|-------------|------------|
| `main` | staging | `/opt/<app>/backend/staging`, `/opt/<app>/frontend/staging` |
| `prod` | production | `/opt/<app>/backend/production`, `/opt/<app>/frontend/production` |

Paths follow `/opt/<app>/{frontend,backend}/{staging,production}`.

- **Systemd units**: `*-staging-*.service` and `*-production-*.service` (e.g. `app-backend-staging.service`, `app-frontend-production.service`).
- **Backend**: Binary and migrations go to `/opt/<app>/backend/<env>`. Vault (if used) is under `/var/lib/<app>/backend/<env>/vault`.
- **Frontend**: SSR build and `serve.mjs` go to `/opt/<app>/frontend/<env>`.

See **infra/systemd/README.md** for GitHub Environments, secrets, and VM directory setup.

## Other deployment options

### Backend (Docker or binary)

- **Docker**: `docker build` from `apps/backend`; run with appropriate env (e.g. `DATABASE_URL`, `PORT`).
- **Bare metal**: `cargo build --release` and run the binary with env set.

### Documentation site

The docs app is a static Docusaurus site. Build with `pnpm docs build`; deploy to Cloudflare Pages, Vercel, Netlify, or GitHub Pages as needed.

## Environment variables

- **Frontend (VM)**: `PORT`, `BACKEND_API_URL` or `PUBLIC_API_URL` (backend base URL for the same env).
- **Backend**: `PORT`, `DATABASE_URL`, `VAULT_PATH`, `VAULT_ENCRYPTION_KEY` (if used).

## CI/CD

GitHub Actions workflows in `.github/workflows/` handle format, lint, test, version bump, build, and deploy. Frontend and backend workflows deploy to staging (merge to `main`) or production (merge to `prod`) on the VM via systemd.
