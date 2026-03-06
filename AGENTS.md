# Agent and LLM instructions for this repo

This file gives rules for Cursor, other LLMs, and code generators working in this repository.

## Frontend: SSR only, no static build

- **The frontend is always a Server-Side Rendered (SSR) app.** Use **only** `@sveltejs/adapter-node`. Do **not** use `@sveltejs/adapter-static` or any static-only adapter.
- The app runs as a Node server on the VM (systemd). Production entry is `node serve.mjs` (which runs the adapter-node build).
- Do not add or suggest adapter-static, Vercel adapter, or static export for the main app.

## Frontend talks to backend via proxy

- The frontend **does not** call the backend by its own URL from the client. All API usage goes through the same origin:
  - Server-side code: `fetch('/api/...')` is rewritten to the backend by `hooks.server.ts` (`handleFetch`).
  - Client-side: The browser calls `/api/...` on the frontend; the route `src/routes/api/[...path]/+server.ts` proxies to the backend.
- Backend base URL is set per environment with `BACKEND_API_URL` or `PUBLIC_API_URL` (staging vs production).

## VM deployment layout (staging and production)

- Each app has **two environments** on the VM: **staging** and **production**.
- **Paths** (layout: `/opt/<app>/{frontend,backend}/{staging,production}`):
  - Staging: `/opt/<app>/backend/staging`, `/opt/<app>/frontend/staging`
  - Production: `/opt/<app>/backend/production`, `/opt/<app>/frontend/production`
- **Systemd**: Services are named like `*-staging-*.service` and `*-production-*.service` (e.g. `app-backend-staging.service`, `app-frontend-production.service`).
- Templates for these units are in `infra/systemd/*.service.example`; apply with `pnpm run apply-template`.

## Summary for code changes

1. **Frontend**: Keep adapter-node; keep `/api` proxy to backend; do not switch to static build.
2. **Deploy**: Keep deploy dirs as `/opt/<app>/{frontend,backend}/{staging,production}`; keep *-staging-* and *-production-* systemd naming.
3. **Backend**: Deploy backend binary and migrations under `/opt/<app>/<env>/backend` for each env.
