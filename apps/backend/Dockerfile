# Build stage
FROM rust:latest-alpine AS builder

WORKDIR /app

RUN apk add --no-cache musl-dev pkgconfig openssl-dev

# Copy dependency files
COPY Cargo.toml Cargo.lock* ./

# Create a dummy main.rs to cache dependencies
RUN mkdir src && \
    echo "fn main() {}" > src/main.rs && \
    cargo build --release && \
    rm -rf src

# Copy source code
COPY . .

# Build the application
RUN cargo build --release

# Runtime stage
FROM alpine:3.19

RUN apk add --no-cache ca-certificates

WORKDIR /app

# Copy the binary from builder
COPY --from=builder /app/target/release/backend /app/backend

EXPOSE 3000

CMD ["./backend"]

