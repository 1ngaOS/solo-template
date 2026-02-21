# Environment files and GitHub secrets

This folder holds **example** env files. The apply-template script creates the actual env files (without the `.example` suffix) and applies template placeholders.

## Files

| Example file           | Created file   | Purpose |
|------------------------|----------------|---------|
| `env.env.example`      | `env.env`      | Repo-level secrets (used by all environments) |
| `staging.env.example`  | `staging.env`  | Staging environment secrets |
| `prod.env.example`     | `prod.env`     | Production environment secrets |

Generated files (`env.env`, `staging.env`, `prod.env`) are in `.gitignore` — do not commit them.

## Setup

1. **Run apply-template** (from repo root):
   ```bash
   pnpm run apply-template
   ```
   This creates `envs/env.env`, `envs/staging.env`, and `envs/prod.env` from the `.example` files.

2. **Fill in secrets** in the created files (e.g. `DATABASE_URL`, `VM_IP`, `SSH_PRIVATE_KEY`, etc.).

3. **Push secrets to GitHub** using `cgs` (run these from the **envs** folder):
   ```bash
   cd envs
   ```
   - **Repo secrets** (from `env.env`):
     ```bash
     cgs env.env
     ```
   - **Staging environment** and its secrets (from `staging.env`):
     ```bash
     cgs staging.env
     ```
   - **Production environment** and its secrets (from `prod.env`):
     ```bash
     cgs prod.env env production
     ```

## cgs commands summary

Run all `cgs` commands from the **envs** folder (`cd envs`):

| Command | Effect |
|---------|--------|
| `cgs env.env` | Create/update **repo** secrets from `env.env` |
| `cgs staging.env` | Create **staging** environment and its secrets from `staging.env` |
| `cgs prod.env env production` | Create **production** environment and its secrets from `prod.env` |

Ensure `cgs` is installed and you are authenticated to the repo before running these commands.
