# Systemd units for VM deployment

CI/CD deploys to two environments:

| Branch   | Environment | Deploy path (on VM)              | Systemd unit          |
|----------|-------------|----------------------------------|------------------------|
| `main`   | **staging** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/staging`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/staging` | `__TEMPLATE_SYSTEMD_BACKEND_STAGING__`, `__TEMPLATE_SYSTEMD_FRONTEND_STAGING__` |
| `prod`   | **production** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/production`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/production` | `__TEMPLATE_SYSTEMD_BACKEND_PRODUCTION__`, `__TEMPLATE_SYSTEMD_FRONTEND_PRODUCTION__` |

## GitHub setup

1. **Environments**  
   In the repo: **Settings → Environments**. Create:
   - `staging` (used when a PR is merged to `main`)
   - `production` (used when pushing/merging to `prod`)

2. **Secrets** (repository or environment-level)  
   - `VM_IP` – VM host  
   - `VM_USER` – SSH user  
   - `SSH_PRIVATE_KEY` – Private key for SSH  
   - `VM_SSH_PORT` – (optional) SSH port, default 22  
   - `VM_APP_NAME` – (optional) App name used in `/opt/<name>/...`, default `__TEMPLATE_DEPLOY_APP_NAME__`

## VM setup

1. Create directories (replace `__TEMPLATE_DEPLOY_APP_NAME__` if using `VM_APP_NAME`):
   ```bash
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/{staging,production}/bin
   sudo mkdir -p /opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/{staging,production}
   ```

2. **Service files**: Run `pnpm run apply-template` (from repo root) so that the script creates the actual systemd unit files from the `.example` templates (e.g. `__TEMPLATE_FRONTEND_STAGING_SERVICE_FILE__`, `__TEMPLATE_BACKEND_STAGING_SERVICE_FILE__`, etc.). Commit the created files under `infra/systemd/`; CI/CD copies them during deploy and installs them on the VM. If you prefer to install by hand, copy the generated files (not the `.example` ones) and ensure paths match your app name.

3. Enable and start (after first deploy):
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable __TEMPLATE_SYSTEMD_BACKEND_STAGING__ __TEMPLATE_SYSTEMD_FRONTEND_STAGING__ __TEMPLATE_SYSTEMD_BACKEND_PRODUCTION__ __TEMPLATE_SYSTEMD_FRONTEND_PRODUCTION__
   sudo systemctl start __TEMPLATE_SYSTEMD_BACKEND_STAGING__ __TEMPLATE_SYSTEMD_FRONTEND_STAGING__   # or production
   ```
