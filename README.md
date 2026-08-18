# LogTrace

Distributed Log Aggregator & Real-Time Monitoring Platform.

Client microservices push structured application logs (INFO/WARN/ERROR/DEBUG) to
the **Spring Boot** backend via a REST ingestion endpoint. Logs are persisted to
MySQL (Aiven-compatible, SSL) and instantly broadcast over **STOMP/WebSocket**
to a **React (Vite) + Tailwind** dark-mode dashboard for live tailing, filtering,
search, and analytics.

```
logtrace/
├── backend/     # Spring Boot 3 / Java 17 REST + WebSocket API
├── frontend/    # React (Vite) dashboard
└── docker-compose.yml
```

## Quick start (local, no Docker)

**1. Backend**
```bash
cd backend
export DB_HOST=your-aiven-host DB_PORT=... DB_NAME=logtrace DB_USER=avnadmin DB_PASSWORD=...
mvn spring-boot:run
```

**2. Frontend**
```bash
cd frontend
npm install
cp .env.example .env
npm run dev
```

Open `http://localhost:5173`. Click **Services → Add** to register your first
client service and grab its API key, then use the generated cURL command to
send a test log and watch it appear in the live tail instantly.

## Quick start (Docker Compose)

```bash
export DB_HOST=... DB_PORT=... DB_NAME=logtrace DB_USER=... DB_PASSWORD=...
docker compose up --build
```

- Backend: `http://localhost:8080`
- Frontend: `http://localhost:80`

## Architecture notes

- **Multi-tenancy**: each client microservice registers as an `AppService`
  with its own auto-generated UUID API key; all ingested logs are scoped to
  that service via a foreign key.
- **Real-time delivery**: `LogIngestionService` persists each incoming log,
  then publishes it to both a per-service topic (`/topic/logs/{serviceId}`)
  and a global topic (`/topic/logs/all`) using Spring's in-memory STOMP broker.
  The frontend subscribes via SockJS + `@stomp/stompjs`.
- **Security**: ingestion requests are authenticated with a per-service
  `X-API-KEY` header, validated by `ApiKeyAuthFilter`. Dashboard read endpoints
  are open (add JWT/OAuth in front of them for production multi-user access).
- **Search & filters**: `LogQueryService` builds dynamic JPA Specifications for
  service, level(s), free-text query (message/stack trace), and date range,
  with standard Spring Data pagination.
