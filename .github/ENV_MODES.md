# CI/CD environment modes

All deployment workflows use the same **env mode** mapping. Configure GitHub Environments and secrets per env.

## Branch → environment

| Branch   | GitHub Environment | VM path (per app)        | Systemd units        |
|----------|--------------------|--------------------------|-----------------------|
| `main`   | **staging**        | `/opt/<app>/{frontend,backend}/staging` | `*-staging-*.service` |
| `uat`    | **staging**        | `/opt/<app>/{frontend,backend}/staging` | `*-staging-*.service` |
| `prod`   | **production**     | `/opt/<app>/{frontend,backend}/production` | `*-production-*.service` |

- **Staging**: used for `main` and `uat`. One staging slot per app (frontend + backend).
- **Production**: used for `prod` only.

## When deploy runs

- **Frontend** and **Backend** workflows deploy when a PR is **merged** into:
  - `main` → deploy to **staging**
  - `uat`  → deploy to **staging**
  - `prod` → deploy to **production**

## GitHub setup

1. **Environments** (Settings → Environments): create `staging` and `production`.
2. **Secrets**: set per environment (or repo-level):
   - **Staging / Production**: `VM_IP` or `SSH_IP`, `VM_USER` or `SSH_USERNAME`, `SSH_PRIVATE_KEY`, optional `VM_SSH_PORT` / `SSH_PORT`, optional `VM_APP_NAME`.
   - **Backend**: `DATABASE_URL`, optional `VAULT_ENCRYPTION_KEY` (often different per environment).
   - **Frontend**: optional `PUBLIC_API_URL` (defaults to `http://127.0.0.1:<backend_port>` for same env).

## Aligning workflows

- Every workflow that deploys must use the same rule: **prod → production**, **main/uat → staging**.
- Deploy job must set `environment: ${{ github.event.pull_request.base.ref == 'prod' && 'production' || 'staging' }}`.
- “Determine deployment environment” steps must output the same semantics: `environment=staging` or `environment=production`, and paths must use `/opt/<app>/{frontend,backend}/{staging,production}`.
