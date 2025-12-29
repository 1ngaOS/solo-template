# Deployment

This guide covers deployment options for the Solo Monorepo Template.

## Frontend Deployment

The frontend is built as a static site and can be deployed to:

- **Cloudflare Pages**: Connect your repository and deploy automatically
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Connect your repository for automatic deployments
- **GitHub Pages**: Use GitHub Actions to deploy on push

### Build Command

```bash
pnpm frontend build
```

The build output will be in `apps/frontend/build`.

## Backend Deployment

The backend can be deployed as:

- **Docker Container**: Build and deploy using Docker
- **Bare Metal**: Build the binary and run directly
- **Cloud Providers**: Deploy to AWS, GCP, Azure, etc.

### Docker Build

```bash
cd apps/backend
docker build -t backend .
docker run -p 3000:3000 backend
```

### Binary Build

```bash
cd apps/backend
cargo build --release
./target/release/backend
```

## Documentation Deployment

The documentation site can be deployed similarly to the frontend:

- **Cloudflare Pages**
- **Vercel**
- **Netlify**
- **GitHub Pages**

### Build Command

```bash
pnpm docs build
```

The build output will be in `apps/docs/build`.

## Environment Variables

Configure environment variables as needed for your deployment:

- `PORT`: Server port (default: 3000)
- `DATABASE_URL`: Database connection string (if using database)
- `CORS_ORIGIN`: Allowed CORS origins

## CI/CD

GitHub Actions workflows are included for automated testing and deployment. See `.github/workflows/` for configuration.

