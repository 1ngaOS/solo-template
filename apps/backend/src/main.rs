use axum::{
    http::StatusCode,
    response::Json,
    routing::{get, post},
    Router,
};
use serde::{Deserialize, Serialize};
use std::net::SocketAddr;
use tower_http::cors::CorsLayer;
use tower_http::trace::TraceLayer;

#[derive(Serialize, Deserialize)]
struct HealthResponse {
    status: String,
    version: String,
    timestamp: String,
}

#[derive(Serialize, Deserialize)]
struct ApiInfo {
    name: String,
    version: String,
    endpoints: Vec<String>,
}

#[derive(Serialize, Deserialize)]
struct MessageRequest {
    message: String,
}

#[derive(Serialize, Deserialize)]
struct MessageResponse {
    echo: String,
    received_at: String,
}

#[tokio::main]
async fn main() {
    // Initialize tracing
    tracing_subscriber::fmt()
        .with_env_filter("backend=debug,tower_http=debug")
        .init();

    // Build application with routes
    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health))
        .route("/api/v1/info", get(api_info))
        .route("/api/v1/echo", post(echo))
        .layer(CorsLayer::permissive())
        .layer(TraceLayer::new_for_http());

    // Run server
    let addr = SocketAddr::from(([0, 0, 0, 0], 3000));
    tracing::info!("🚀 Server starting on http://{}", addr);

    let listener = tokio::net::TcpListener::bind(&addr).await.unwrap();
    axum::serve(listener, app).await.unwrap();
}

/// Root endpoint
async fn root() -> Json<serde_json::Value> {
    Json(serde_json::json!({
        "name": "__TEMPLATE_APP_NAME__ Backend",
        "description": "__TEMPLATE_APP_DESCRIPTION__",
        "version": env!("CARGO_PKG_VERSION"),
        "endpoints": {
            "health": "/health",
            "api_info": "/api/v1/info",
            "echo": "/api/v1/echo"
        }
    }))
}

/// Health check endpoint
async fn health() -> Json<HealthResponse> {
    Json(HealthResponse {
        status: "ok".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
        timestamp: chrono::Utc::now().to_rfc3339(),
    })
}

/// API information endpoint
async fn api_info() -> Json<ApiInfo> {
    Json(ApiInfo {
        name: "__TEMPLATE_APP_NAME__ API".to_string(),
        version: "v1".to_string(),
        endpoints: vec![
            "/api/v1/info".to_string(),
            "/api/v1/echo".to_string(),
        ],
    })
}

/// Echo endpoint - returns the message sent
async fn echo(Json(payload): Json<MessageRequest>) -> Result<Json<MessageResponse>, StatusCode> {
    Ok(Json(MessageResponse {
        echo: payload.message,
        received_at: chrono::Utc::now().to_rfc3339(),
    }))
}

