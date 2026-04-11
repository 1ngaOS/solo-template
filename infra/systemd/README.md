# Systemd units for VM deployment

Each app is deployed in **two environments** on the VM: **staging** and **production**. Paths and service names are env-specific. CI/CD uses the same **env mode** mapping for all workflows; see [.github/ENV_MODES.md](../../.github/ENV_MODES.md).

## Naming Convention

Service files follow the naming pattern: **`{appname}-{env}-{frontend|backend}.service`**

Examples:
- `myapp-staging-frontend.service`
- `myapp-staging-backend.service`
- `myapp-production-frontend.service`
- `myapp-production-backend.service`

This convention ensures consistent identification of services across multiple apps on the same VM.

## Port Allocation

Each service has a **dedicated port** configured via environment variables:

| Component | Environment | Default Port Range | Example Port |
|-----------|-------------|-------------------|--------------|
| Backend   | Staging     | 6100-6199         | 6100         |
| Frontend  | Staging     | 6200-6299         | 6200         |
| Backend   | Production  | 6300-6399         | 6300         |
| Frontend  | Production  | 6400-6499         | 6400         |

Ports are configured in `template.config.yaml` under `deployment:` section and applied via `pnpm run apply-template`.

### Finding Available Ports

Use the provided script to scan running services and find available ports:

```bash
# Scan all services and get recommendations
./scripts/find-available-port.sh

# Filter by app name
./scripts/find-available-port.sh myapp

# Filter by environment
./scripts/find-available-port.sh myapp staging

# Filter by component
./scripts/find-available-port.sh myapp production backend
```

The script will:
1. Scan `/etc/systemd/system` and `/lib/systemd/system` for matching service files
2. Extract configured ports from service files
3. Check which ports are actively listening
4. Recommend available ports in the appropriate ranges

| Branch   | Environment | Deploy paths (on VM) | Systemd units |
|----------|-------------|----------------------|----------------|
| `main`   | **staging** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/staging`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/staging` | `{appname}-staging-backend.service`, `{appname}-staging-frontend.service` |
| `prod`   | **production** | `/opt/__TEMPLATE_DEPLOY_APP_NAME__/backend/production`, `/opt/__TEMPLATE_DEPLOY_APP_NAME__/frontend/production` | `{appname}-production-backend.service`, `{appname}-production-frontend.service` |

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
