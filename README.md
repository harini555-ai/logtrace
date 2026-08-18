# ⚡ LogTrace


> Real-Time Distributed Log Aggregator & Observability Platform


LogTrace is a full-stack log monitoring platform built for distributed microservices. It allows services to securely send logs, stores them in MySQL, and displays them in real time on a React dashboard using WebSocket and STOMP.


## 🚀 Features


- Real-time log streaming
- Microservice registration
- API key authentication
- Log ingestion through REST API
- Search and filter logs
- Service-wise log monitoring
- Error, warning, info, and debug logs
- Real-time analytics dashboard
- MySQL database
- Docker support
- Cloud deployment ready


## 🛠️ Tech Stack


- **Backend:** Java 17, Spring Boot 3, Spring Data JPA
- **Frontend:** React 18, Vite, Tailwind CSS
- **Real-Time:** WebSocket, STOMP
- **Database:** MySQL 8
- **DevOps:** Docker, Docker Compose
- **Deployment:** Render, Vercel, Aiven


## 📂 Project Structure


```text
logtrace/
├── backend/
│   ├── src/
│   ├── Dockerfile
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   ├── Dockerfile
│   └── package.json
│
├── docker-compose.yml
└── README.md

⚡ How It Works
Microservice
     ↓
REST API + API Key
     ↓
Spring Boot Backend
     ↓
MySQL Database
     ↓
WebSocket / STOMP
     ↓
React Dashboard

🔌 API Usage
Register Service
curl -X POST http://localhost:8080/api/services \
  -H "Content-Type: application/json" \
  -d '{
    "name": "payment-service",
    "environment": "PRODUCTION"
  }'
Send Log
curl -X POST http://localhost:8080/api/logs/ingest \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: YOUR_API_KEY" \
  -d '{
    "level": "ERROR",
    "message": "Payment gateway timeout",
    "stackTrace": "SocketTimeoutException",
    "metadata": {
      "orderId": "ord_10293"
    }
  }'

🏗️ Main Components
Backend
REST APIs
API Key Authentication
Log Processing
JPA Specifications
MySQL Persistence
WebSocket/STOMP

Frontend
Live Log Dashboard
Search & Filtering
Service Monitoring
Log Analytics
Real-Time Updates
🐳 Run with Docker
docker compose up --build -d

Frontend:

http://localhost:80

Backend:

http://localhost:8080
🎯 Project Goal

LogTrace provides a centralized platform to collect, monitor, search, and analyze logs from multiple microservices in real time.

👩‍💻 Author

Harini M
