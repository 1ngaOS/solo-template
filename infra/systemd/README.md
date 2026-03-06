# Systemd units for VM deployment

Each app is deployed in **two environments** on the VM: **staging** and **production**. Paths and service names are env-specific. CI/CD uses the same **env mode** mapping for all workflows; see [.github/ENV_MODES.md](../../.github/ENV_MODES.md).

| Branch   | Environment | Deploy paths (on VM) | Systemd units |
|----------|-------------|----------------------|----------------|
| `main`   | **staging** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/staging`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/staging` | `__TEMPLATE_SYSTEMD_BACKEND_STAGING__`, `__TEMPLATE_SYSTEMD_FRONTEND_STAGING__` |
| `prod`   | **production** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/production`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/production` | `__TEMPLATE_SYSTEMD_BACKEND_PRODUCTION__`, `__TEMPLATE_SYSTEMD_FRONTEND_PRODUCTION__` |

Paths follow `/opt/<app>/{frontend,backend}/{staging,production}`.

- **Backend**: Binary and migrations in `/opt/<app>/backend/staging` or `/opt/<app>/backend/production`. Vault (if used): `/var/lib/<app>/backend/staging/vault` or `.../backend/production/vault`.
- **Frontend**: SSR build and `serve.mjs` in `/opt/<app>/frontend/staging` or `/opt/<app>/frontend/production`. The frontend proxies `/api` to the backend in the same env.

## GitHub setup

1. **Environments**  
   In the repo: **Settings → Environments**. Create:
   - `staging` (used when a PR is merged to `main`)
   - `production` (used when pushing/merging to `prod`)

2. **Secrets** (repository or environment-level)  
   - `VM_IP` – VM host (or `SSH_IP` for backend workflow)
   - `VM_USER` – SSH user (or `SSH_USERNAME` for backend workflow)
   - `SSH_PRIVATE_KEY` – Private key for SSH  
   - `VM_SSH_PORT` / `SSH_PORT` – (optional) SSH port, default 22  
   - `VM_APP_NAME` – (optional) App name used in `/opt/<name>/...`, default `__TEMPLATE_DEPLOY_APP_NAME__`

## VM setup

1. Create directories (replace `__TEMPLATE_DEPLOY_APP_NAME__` if using `VM_APP_NAME`):
   ```bash
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/staging
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/production
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/staging
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/production
   ```

2. **Service files**: Run `pnpm run apply-template` (from repo root) so that the script creates the actual systemd unit files from the `.example` templates. Commit the created files under `infra/systemd/`; CI/CD copies them during deploy and installs them on the VM.

3. Enable and start (after first deploy):
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable __TEMPLATE_SYSTEMD_BACKEND_STAGING__ __TEMPLATE_SYSTEMD_FRONTEND_STAGING__ __TEMPLATE_SYSTEMD_BACKEND_PRODUCTION__ __TEMPLATE_SYSTEMD_FRONTEND_PRODUCTION__
   sudo systemctl start __TEMPLATE_SYSTEMD_BACKEND_STAGING__ __TEMPLATE_SYSTEMD_FRONTEND_STAGING__   # or production
   ```
