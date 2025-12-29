# Backend API Server

Rust-based backend API server using Axum framework.

## Features

- RESTful API endpoints
- CORS support
- Request tracing and logging
- Health check endpoint
- API versioning

## Endpoints

- `GET /` - Root endpoint with API information
- `GET /health` - Health check endpoint
- `GET /api/v1/info` - API information
- `POST /api/v1/echo` - Echo endpoint for testing

## Development

```bash
# Run in development mode with hot reload
pnpm dev

# Build for production
pnpm build

# Run tests
pnpm test

# Lint code
pnpm lint

# Format code
pnpm format
```

## Running the Server

```bash
# Development mode
cargo run

# Production mode
cargo build --release
./target/release/backend
```

The server will start on `http://localhost:3000` by default.

