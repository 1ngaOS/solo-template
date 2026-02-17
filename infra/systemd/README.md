# Systemd units for VM deployment

CI/CD deploys to two environments:

| Branch   | Environment | Deploy path (on VM)              | Systemd unit          |
|----------|-------------|----------------------------------|------------------------|
| `main`   | **staging** | `/opt/app/backend/staging`, `/opt/app/frontend/staging` | `backend-staging`, `frontend-staging` |
| `prod`   | **production** | `/opt/app/backend/production`, `/opt/app/frontend/production` | `backend-production`, `frontend-production` |

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
   - `VM_APP_NAME` – (optional) App name used in `/opt/<name>/...`, default `app`

## VM setup

1. Create directories (replace `app` if using `VM_APP_NAME`):
   ```bash
   sudo mkdir -p /opt/app/backend/{staging,production}/bin
   sudo mkdir -p /opt/app/frontend/{staging,production}
   ```

2. Install the example systemd units:
   ```bash
   sudo cp backend-staging.service.example /etc/systemd/system/backend-staging.service
   sudo cp backend-production.service.example /etc/systemd/system/backend-production.service
   sudo cp frontend-staging.service.example /etc/systemd/system/frontend-staging.service
   sudo cp frontend-production.service.example /etc/systemd/system/frontend-production.service
   ```
   Edit each unit so paths use your app name (e.g. `/opt/app/` → `/opt/myapp/`).

3. Enable and start (after first deploy):
   ```bash
   sudo systemctl daemon-reload
   sudo systemctl enable backend-staging frontend-staging backend-production frontend-production
   sudo systemctl start backend-staging frontend-staging   # or production
   ```
