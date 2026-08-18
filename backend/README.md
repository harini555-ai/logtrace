# LogTrace Backend

Spring Boot 3 / Java 17 backend for the LogTrace distributed log aggregator.

## Run locally

```bash
export DB_HOST=your-aiven-host
export DB_PORT=your-aiven-port
export DB_NAME=logtrace
export DB_USER=avnadmin
export DB_PASSWORD=your-password

mvn spring-boot:run
```

The API will be available at `http://localhost:8080`, and the WebSocket (SockJS/STOMP)
endpoint at `http://localhost:8080/ws-logtrace`.

## Build & run with Docker

```bash
docker build -t logtrace-backend .
docker run -p 8080:8080 \
  -e DB_HOST=your-aiven-host \
  -e DB_PORT=your-aiven-port \
  -e DB_NAME=logtrace \
  -e DB_USER=avnadmin \
  -e DB_PASSWORD=your-password \
  logtrace-backend
```

## Key endpoints

| Method | Path                              | Description                                   |
|--------|-----------------------------------|------------------------------------------------|
| POST   | `/api/services`                   | Register a new client service (auto API key)  |
| GET    | `/api/services`                   | List all registered services                  |
| GET    | `/api/services/{id}`              | Get one service                                |
| POST   | `/api/services/{id}/regenerate-key`| Rotate a service's API key                    |
| DELETE | `/api/services/{id}`              | Delete a service                               |
| POST   | `/api/logs/ingest`                | Ingest a log (requires `X-API-KEY` header)     |
| GET    | `/api/logs`                       | Paginated/filterable log search                |
| GET    | `/api/analytics/summary`          | Log counts by level                            |
| GET    | `/api/health`                     | Health check                                   |

WebSocket topics (STOMP over SockJS at `/ws-logtrace`):
- `/topic/logs/{serviceId}` — live logs for a specific service
- `/topic/logs/all` — live logs across all services

## Sample ingest request

```bash
curl -X POST http://localhost:8080/api/logs/ingest \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: <your-service-api-key>" \
  -d '{
        "level": "ERROR",
        "message": "Payment gateway timeout",
        "stackTrace": "java.net.SocketTimeoutException: connect timed out\n\tat ...",
        "endpoint": "/api/payments/charge"
      }'
```

## Database

Tables are auto-managed by Hibernate (`spring.jpa.hibernate.ddl-auto=update`).
For production, prefer setting `DDL_AUTO=validate` and manage schema via migrations.
