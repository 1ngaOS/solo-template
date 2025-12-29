# API Reference

This document describes the backend API endpoints.

## Base URL

```
http://localhost:3000
```

## Endpoints

### Root Endpoint

**GET** `/`

Returns information about the API.

**Response:**
```json
{
  "name": "Solo Monorepo Template Backend",
  "description": "A Rust-based backend API server",
  "version": "0.1.0",
  "endpoints": {
    "health": "/health",
    "api_info": "/api/v1/info",
    "echo": "/api/v1/echo"
  }
}
```

### Health Check

**GET** `/health`

Returns the health status of the API.

**Response:**
```json
{
  "status": "ok",
  "version": "0.1.0",
  "timestamp": "2024-01-01T00:00:00Z"
}
```

### API Information

**GET** `/api/v1/info`

Returns API information and available endpoints.

**Response:**
```json
{
  "name": "Solo Monorepo Template API",
  "version": "v1",
  "endpoints": [
    "/api/v1/info",
    "/api/v1/echo"
  ]
}
```

### Echo

**POST** `/api/v1/echo`

Echoes back the message sent in the request.

**Request Body:**
```json
{
  "message": "Hello, World!"
}
```

**Response:**
```json
{
  "echo": "Hello, World!",
  "received_at": "2024-01-01T00:00:00Z"
}
```

