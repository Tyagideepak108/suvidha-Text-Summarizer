# Suvidha Text Summarizer - Architecture

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER (Browser)                          │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTP Request
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    NGINX (Port 80)                              │
│                   Reverse Proxy                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Routes:                                                  │  │
│  │  • /          → Frontend (Next.js)                       │  │
│  │  • /api/*     → Backend (Express)                        │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────┬─────────────────────────────┬────────────────────┘
               │                             │
               │                             │
       ┌───────▼────────┐           ┌────────▼────────┐
       │   FRONTEND     │           │    BACKEND      │
       │   (Next.js)    │           │   (Express.js)  │
       │   Port 3000    │◄──────────│   Port 3002     │
       │                │   API     │                 │
       │  • React       │  Calls    │  • REST API     │
       │  • TypeScript  │           │  • JWT Auth     │
       │  • Tailwind    │           │  • Middleware   │
       └────────────────┘           └─────────┬───────┘
                                              │
                    ┌─────────────────────────┼─────────────────────┐
                    │                         │                     │
            ┌───────▼────────┐       ┌────────▼────────┐   ┌───────▼────────┐
            │   POSTGRESQL   │       │     REDIS       │   │    BULLMQ      │
            │   Port 5432    │       │   Port 6379     │   │    WORKER      │
            │                │       │                 │   │                │
            │  • Users       │       │  • Cache        │   │  • Job Queue   │
            │  • Articles    │       │  • Sessions     │   │  • AI Process  │
            │  • Summaries   │       │  • Job Queue    │   │  • Background  │
            └────────────────┘       └─────────────────┘   └────────┬───────┘
                                                                     │
                                                                     │
                                                            ┌────────▼────────┐
                                                            │  HUGGING FACE   │
                                                            │   AI Models     │
                                                            │                 │
                                                            │  • BART         │
                                                            │  • DistilBART   │
                                                            │  • Pegasus      │
                                                            └─────────────────┘
```

---

## Request Flow

### 1. User Signup/Login Flow
```
User → Nginx → Frontend → Backend → PostgreSQL
                                  ↓
                              JWT Token
                                  ↓
                            Store in localStorage
```

### 2. Text Summarization Flow (Without Cache)
```
User submits text
    ↓
Nginx → Backend
    ↓
Check Redis Cache (MISS)
    ↓
Create Article in PostgreSQL
    ↓
Add Job to BullMQ Queue
    ↓
Return 202 (Processing) to User
    ↓
Worker picks job from Queue
    ↓
Call Hugging Face API
    ↓
Save Summary to PostgreSQL
    ↓
Save to Redis Cache (1 hour)
    ↓
Frontend polls for status
    ↓
Display Summary to User
```

### 3. Text Summarization Flow (With Cache)
```
User submits text
    ↓
Nginx → Backend
    ↓
Check Redis Cache (HIT) ⚡
    ↓
Return cached summary (50ms)
    ↓
Display to User
```

---

## Technology Stack

### Frontend
- **Framework**: Next.js 16
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: React Hooks
- **HTTP Client**: Axios

### Backend
- **Framework**: Express.js
- **Language**: Node.js
- **Authentication**: JWT (jsonwebtoken)
- **ORM**: Sequelize
- **Validation**: Express middleware

### Database
- **Primary DB**: PostgreSQL 15
- **Cache**: Redis 7
- **Queue**: BullMQ (Redis-based)

### AI/ML
- **Provider**: Hugging Face Inference API
- **Models**: 
  - facebook/bart-large-cnn (primary)
  - sshleifer/distilbart-cnn-12-6 (fallback)
  - google/pegasus-xsum (fallback)

### DevOps
- **Containerization**: Docker
- **Orchestration**: Docker Compose
- **Reverse Proxy**: Nginx
- **Environment**: WSL2 (Windows)

---

## Database Schema

### Users Table
```sql
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Articles Table
```sql
CREATE TABLE "Articles" (
  id SERIAL PRIMARY KEY,
  original_text TEXT NOT NULL,
  userId INTEGER REFERENCES "Users"(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

### Summaries Table
```sql
CREATE TABLE "Summaries" (
  id SERIAL PRIMARY KEY,
  summary_text TEXT NOT NULL,
  articleId INTEGER REFERENCES "Articles"(id),
  userId INTEGER REFERENCES "Users"(id),
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

---

## API Endpoints

### Authentication
```
POST /api/auth/signup
POST /api/auth/login
```

### Summaries
```
POST /api/summaries              (Create summary - returns jobId)
GET  /api/summaries/job/:jobId   (Check job status)
GET  /api/summaries              (Get user's summaries)
```

### Health Check
```
GET /api/health
GET /api/db-test
```

---

## Docker Services

### 1. PostgreSQL
- **Image**: postgres:15-alpine
- **Port**: 5432
- **Volume**: postgres_data
- **Health Check**: pg_isready

### 2. Redis
- **Image**: redis:7-alpine
- **Port**: 6379
- **Volume**: redis_data
- **Health Check**: redis-cli ping

### 3. Backend
- **Build**: ./backend/Dockerfile
- **Port**: 3002
- **Depends**: postgres, redis
- **Environment**: NODE_ENV=docker

### 4. Worker
- **Build**: ./backend/Dockerfile
- **Command**: node workers/summarizationWorker.js
- **Depends**: postgres, redis

### 5. Frontend
- **Build**: ./frontend/Dockerfile
- **Port**: 3000
- **Depends**: backend

### 6. Nginx
- **Image**: nginx:alpine
- **Port**: 80
- **Config**: ./nginx/nginx.conf
- **Depends**: frontend, backend

---

## Security Features

1. ✅ **JWT Authentication** - Secure token-based auth
2. ✅ **Password Hashing** - bcrypt (10 rounds)
3. ✅ **Environment Variables** - Sensitive data in .env
4. ✅ **CORS** - Configured for security
5. ✅ **Input Validation** - Request body validation
6. ✅ **SQL Injection Prevention** - Sequelize ORM

---

## Performance Optimizations

1. ✅ **Redis Caching** - 1 hour TTL
2. ✅ **Background Jobs** - Async processing
3. ✅ **Connection Pooling** - Database connections
4. ✅ **Docker Multi-stage Builds** - Smaller images
5. ✅ **Nginx Reverse Proxy** - Load balancing ready

---

## Scalability Considerations

### Horizontal Scaling
- Multiple backend instances behind Nginx
- Multiple worker instances for job processing
- Redis cluster for distributed caching

### Vertical Scaling
- Increase container resources
- Database connection pool size
- Worker concurrency settings

---

## Monitoring & Logging

### Current Implementation
- Console logs for all services
- Docker logs accessible via `docker-compose logs`
- Job status tracking in BullMQ

### Future Enhancements
- Prometheus metrics
- Grafana dashboards
- ELK stack for log aggregation
- Sentry for error tracking

---

## Deployment Strategy

### Development
```bash
docker-compose up
```

### Production
```bash
docker-compose -f docker-compose.prod.yml up -d
```

### CI/CD Pipeline (Future)
1. GitHub Actions
2. Automated testing
3. Docker image build
4. Push to registry
5. Deploy to cloud (AWS/Azure/GCP)

---

## Cost Optimization

1. ✅ **Redis Caching** - Reduces API calls
2. ✅ **Background Jobs** - Efficient resource usage
3. ✅ **Docker** - Resource isolation
4. ✅ **Model Fallback** - Availability guarantee

---

## Backup & Recovery

### Database Backups
```bash
docker-compose exec postgres pg_dump -U postgres suvidha_db > backup.sql
```

### Restore
```bash
docker-compose exec -T postgres psql -U postgres suvidha_db < backup.sql
```

### Volume Backups
- Docker volumes persist data
- Regular snapshots recommended

---

**Architecture designed for scalability, performance, and maintainability!** 🚀
