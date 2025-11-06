# 🏗️ Suvidha Text Summarizer - Architecture Documentation

## 📊 System Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                    USER (Browser/Mobile)                        │
└────────────────────────────┬────────────────────────────────────┘
                             │
                             │ HTTPS
                             ▼
┌─────────────────────────────────────────────────────────────────┐
│                    VERCEL CDN (Frontend)                        │
│              https://suvidha-text-summarizer.vercel.app         │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Next.js 16 Application (SSR + Static)                   │  │
│  │  • React Components                                       │  │
│  │  • TypeScript                                            │  │
│  │  • Tailwind CSS                                          │  │
│  │  • NextAuth.js (OAuth)                                   │  │
│  └──────────────────────────────────────────────────────────┘  │
└──────────────┬──────────────────────────────────────────────────┘
               │
               │ API Calls (HTTPS)
               ▼
┌─────────────────────────────────────────────────────────────────┐
│                   RENDER.COM (Backend)                          │
│           https://suvidha-text-summarizer.onrender.com          │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │  Express.js API Server                                    │  │
│  │  • REST API Endpoints                                     │  │
│  │  • JWT Authentication                                     │  │
│  │  • Direct AI Summarization                               │  │
│  │  • Sequelize ORM                                         │  │
│  └────────────┬─────────────────────────────────────────────┘  │
└───────────────┼──────────────────────────────────────────────────┘
                │
                │
        ┌───────┴────────┬──────────────────┐
        │                │                  │
        ▼                ▼                  ▼
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  POSTGRESQL  │  │ HUGGING FACE │  │   NEXTAUTH   │
│  (Render)    │  │  Inference   │  │   (OAuth)    │
│              │  │     API      │  │              │
│  • Users     │  │              │  │  • Google    │
│  • Articles  │  │  • BART      │  │  • GitHub    │
│  • Summaries │  │  • Models    │  │              │
└──────────────┘  └──────────────┘  └──────────────┘
```

---

## 🔄 Request Flow Diagrams

### 1️⃣ User Signup/Login Flow (Email/Password)

```
┌──────┐
│ User │
└──┬───┘
   │ 1. Enter email/password
   ▼
┌────────────────┐
│ Vercel Frontend│
│  (Signup Page) │
└──┬─────────────┘
   │ 2. POST /auth/signup
   ▼
┌────────────────┐
│ Render Backend │
│  (Express API) │
└──┬─────────────┘
   │ 3. Hash password (bcrypt)
   ▼
┌────────────────┐
│   PostgreSQL   │
│  (Create User) │
└──┬─────────────┘
   │ 4. User created
   ▼
┌────────────────┐
│ Generate JWT   │
│    Token       │
└──┬─────────────┘
   │ 5. Return token
   ▼
┌────────────────┐
│  localStorage  │
│  Save token    │
└────────────────┘
```

### 2️⃣ OAuth Login Flow (Google/GitHub)

```
┌──────┐
│ User │
└──┬───┘
   │ 1. Click "Login with Google"
   ▼
┌────────────────┐
│   NextAuth.js  │
│   (Frontend)   │
└──┬─────────────┘
   │ 2. Redirect to Google
   ▼
┌────────────────┐
│ Google OAuth   │
│   Consent      │
└──┬─────────────┘
   │ 3. User approves
   ▼
┌────────────────┐
│   NextAuth.js  │
│   Callback     │
└──┬─────────────┘
   │ 4. POST /auth/oauth-login
   ▼
┌────────────────┐
│ Render Backend │
│ Find/Create    │
│     User       │
└──┬─────────────┘
   │ 5. Return JWT token
   ▼
┌────────────────┐
│  Dashboard     │
│  Save token    │
│  localStorage  │
└────────────────┘
```

### 3️⃣ Text Summarization Flow

```
┌──────┐
│ User │
└──┬───┘
   │ 1. Paste text
   ▼
┌────────────────┐
│ Summarize Page │
│   (Frontend)   │
└──┬─────────────┘
   │ 2. POST /summaries
   │    + JWT token
   ▼
┌────────────────┐
│ Render Backend │
│ Verify JWT     │
└──┬─────────────┘
   │ 3. Create Article
   ▼
┌────────────────┐
│   PostgreSQL   │
│ Save Article   │
└──┬─────────────┘
   │ 4. Article ID
   ▼
┌────────────────┐
│ Hugging Face   │
│  API Call      │
│  (BART Model)  │
└──┬─────────────┘
   │ 5. Summary text
   ▼
┌────────────────┐
│   PostgreSQL   │
│ Save Summary   │
└──┬─────────────┘
   │ 6. Return summary
   ▼
┌────────────────┐
│    Frontend    │
│ Display Result │
└────────────────┘
```

---

## 🛠️ Technology Stack

### Frontend (Vercel)
| Technology | Version | Purpose |
|------------|---------|---------|
| Next.js | 16.0 | React framework with SSR |
| React | 18+ | UI library |
| TypeScript | 5+ | Type safety |
| Tailwind CSS | 3+ | Styling |
| NextAuth.js | 4+ | OAuth authentication |
| Axios | 1+ | HTTP client |

### Backend (Render)
| Technology | Version | Purpose |
|------------|---------|---------|
| Node.js | 20+ | Runtime |
| Express.js | 4+ | Web framework |
| Sequelize | 6+ | ORM |
| JWT | - | Authentication |
| bcryptjs | 2+ | Password hashing |
| dotenv | 16+ | Environment variables |

### Database (Render PostgreSQL)
| Technology | Version | Purpose |
|------------|---------|---------|
| PostgreSQL | 16 | Primary database |
| Sequelize CLI | 6+ | Migrations |

### AI/ML
| Service | Model | Purpose |
|---------|-------|---------|
| Hugging Face | facebook/bart-large-cnn | Text summarization |

### Deployment
| Platform | Service | URL |
|----------|---------|-----|
| Vercel | Frontend | https://suvidha-text-summarizer.vercel.app |
| Render | Backend | https://suvidha-text-summarizer.onrender.com |
| Render | PostgreSQL | Internal connection |

---

## 💾 Database Schema

### Users Table
```sql
CREATE TABLE "Users" (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_users_email ON "Users"(email);
```

### Articles Table
```sql
CREATE TABLE "Articles" (
  id SERIAL PRIMARY KEY,
  original_text TEXT NOT NULL,
  userId INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_articles_userId ON "Articles"(userId);
```

### Summaries Table
```sql
CREATE TABLE "Summaries" (
  id SERIAL PRIMARY KEY,
  summary_text TEXT NOT NULL,
  articleId INTEGER REFERENCES "Articles"(id) ON DELETE CASCADE,
  userId INTEGER REFERENCES "Users"(id) ON DELETE CASCADE,
  createdAt TIMESTAMP DEFAULT NOW(),
  updatedAt TIMESTAMP DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_summaries_userId ON "Summaries"(userId);
CREATE INDEX idx_summaries_articleId ON "Summaries"(articleId);
```

### Relationships
```
Users (1) ──────< (N) Articles
Users (1) ──────< (N) Summaries
Articles (1) ────< (N) Summaries
```

---

## 🔌 API Endpoints

### Authentication Endpoints

#### POST /auth/signup
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "User created successfully!",
  "userId": 1
}
```

#### POST /auth/login
**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```
**Response:**
```json
{
  "message": "Login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

#### POST /auth/oauth-login
**Request:**
```json
{
  "email": "user@gmail.com",
  "name": "User Name"
}
```
**Response:**
```json
{
  "message": "OAuth login successful!",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "userId": 1
}
```

### Summary Endpoints

#### POST /summaries
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Request:**
```json
{
  "original_text": "Long text to summarize..."
}
```
**Response:**
```json
{
  "message": "Summary generated successfully!",
  "summary": {
    "id": 1,
    "summary_text": "Concise summary...",
    "articleId": 1,
    "original_text": "Long text..."
  }
}
```

#### GET /summaries
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Response:**
```json
{
  "summaries": [
    {
      "id": 1,
      "summary_text": "Summary...",
      "createdAt": "2024-11-06T10:00:00Z",
      "Article": {
        "original_text": "Original..."
      }
    }
  ]
}
```

#### DELETE /summaries/:id
**Headers:**
```
Authorization: Bearer <JWT_TOKEN>
```
**Response:**
```json
{
  "message": "Summary deleted successfully!"
}
```

### Health Check Endpoints

#### GET /health
**Response:**
```json
{
  "status": "OK",
  "message": "Backend is running!"
}
```

#### GET /db-test
**Response:**
```json
{
  "status": "OK",
  "message": "Database connected!"
}
```

---

## 🔐 Security Implementation

### 1. Authentication
- **JWT Tokens**: 24-hour expiry
- **Password Hashing**: bcrypt with 10 salt rounds
- **Token Storage**: localStorage (client-side)

### 2. Authorization
- **Middleware**: JWT verification on protected routes
- **User Isolation**: Users can only access their own data

### 3. Data Protection
- **Environment Variables**: Sensitive data in .env
- **HTTPS**: All production traffic encrypted
- **CORS**: Configured for frontend domain only

### 4. Database Security
- **SQL Injection**: Prevented by Sequelize ORM
- **Foreign Keys**: Cascade delete for data integrity
- **SSL**: PostgreSQL connection encrypted

---

## 📁 Project Structure

```
suvidha-text-summarizer/
├── frontend/                    # Next.js Frontend
│   ├── app/                    # App Router
│   │   ├── api/               # API routes
│   │   │   └── auth/          # NextAuth
│   │   ├── dashboard/         # Dashboard page
│   │   ├── history/           # History page
│   │   ├── login/             # Login page
│   │   ├── signup/            # Signup page
│   │   ├── summarize/         # Summarize page
│   │   ├── layout.tsx         # Root layout
│   │   └── page.tsx           # Home page
│   ├── components/            # React components
│   │   └── Navbar.tsx         # Navigation bar
│   ├── lib/                   # Utilities
│   │   └── axios.ts           # Axios config
│   ├── services/              # API services
│   │   └── authService.ts     # Auth API calls
│   ├── public/                # Static files
│   ├── .env.local             # Environment variables
│   ├── package.json           # Dependencies
│   └── tailwind.config.js     # Tailwind config
│
├── backend/                    # Express.js Backend
│   ├── config/                # Configuration
│   │   ├── config.json        # Database config
│   │   ├── queue.js           # Queue config (disabled)
│   │   └── redis.js           # Redis config (disabled)
│   ├── middleware/            # Express middleware
│   │   ├── auth.js            # JWT verification
│   │   └── cache.js           # Cache middleware (disabled)
│   ├── migrations/            # Database migrations
│   │   ├── *-create-user.js
│   │   ├── *-create-article.js
│   │   └── *-create-summary.js
│   ├── models/                # Sequelize models
│   │   ├── index.js           # Model loader
│   │   ├── user.js            # User model
│   │   ├── article.js         # Article model
│   │   └── summary.js         # Summary model
│   ├── routes/                # API routes
│   │   ├── auth.js            # Auth endpoints
│   │   └── summaries.js       # Summary endpoints
│   ├── workers/               # Background workers (disabled)
│   │   └── summarizationWorker.js
│   ├── .env                   # Environment variables
│   ├── index.js               # Entry point
│   └── package.json           # Dependencies
│
├── .gitignore                 # Git ignore rules
├── README.md                  # Project documentation
└── ARCHITECTURE.md            # This file
```

---

## 🚀 Deployment Architecture

### Vercel (Frontend)
```
GitHub Push
    ↓
Vercel Auto-Deploy
    ↓
Build Next.js App
    ↓
Deploy to CDN
    ↓
Live at: suvidha-text-summarizer.vercel.app
```

**Environment Variables:**
- `NEXT_PUBLIC_API_URL`
- `NEXTAUTH_URL`
- `NEXTAUTH_SECRET`
- `GOOGLE_CLIENT_ID`
- `GOOGLE_CLIENT_SECRET`
- `GITHUB_CLIENT_ID`
- `GITHUB_CLIENT_SECRET`

### Render (Backend)
```
GitHub Push
    ↓
Render Auto-Deploy
    ↓
Run Migrations (npx sequelize-cli db:migrate)
    ↓
Start Server (node index.js)
    ↓
Live at: suvidha-text-summarizer.onrender.com
```

**Environment Variables:**
- `PORT`
- `NODE_ENV`
- `DATABASE_URL`
- `JWT_SECRET`
- `HUGGINGFACE_API_KEY`

### Render (PostgreSQL)
```
Managed PostgreSQL Instance
    ↓
Automatic Backups
    ↓
Internal Connection
    ↓
Connected to Backend
```

---

## ⚡ Performance Optimizations

### Frontend
1. ✅ **Static Generation**: Next.js pre-renders pages
2. ✅ **Code Splitting**: Automatic route-based splitting
3. ✅ **Image Optimization**: Next.js Image component
4. ✅ **CDN Delivery**: Vercel global CDN

### Backend
1. ✅ **Direct Summarization**: No queue overhead
2. ✅ **Database Indexing**: Fast queries
3. ✅ **Connection Pooling**: Sequelize manages connections
4. ✅ **JWT Stateless Auth**: No session storage needed

### Database
1. ✅ **Indexes**: On foreign keys and email
2. ✅ **Cascade Delete**: Automatic cleanup
3. ✅ **Connection Pooling**: Efficient resource usage

---

## 📊 Monitoring & Logging

### Current Implementation
- **Render Logs**: Real-time backend logs
- **Vercel Logs**: Frontend build and runtime logs
- **Database Logs**: PostgreSQL query logs
- **Console Logging**: Structured logs in backend

### Metrics Tracked
- API response times
- Database query execution
- Authentication success/failure
- Summary generation time
- Error rates

---

## 🔄 CI/CD Pipeline

### Automatic Deployment
```
Developer Push to GitHub
    ↓
GitHub Webhook Triggers
    ↓
┌─────────────────┬─────────────────┐
│                 │                 │
▼                 ▼                 ▼
Vercel Deploy     Render Deploy     
(Frontend)        (Backend)         
    ↓                 ↓             
Build & Test      Migrations        
    ↓                 ↓             
Deploy to CDN     Start Server      
    ↓                 ↓             
✅ Live           ✅ Live           
```

---

## 🛡️ Error Handling

### Frontend
- Try-catch blocks for API calls
- User-friendly error messages
- Redirect to login on 401
- Loading states for async operations

### Backend
- Global error handler middleware
- Structured error responses
- Database transaction rollback
- Graceful degradation

---

## 📈 Scalability Considerations

### Current Capacity
- **Users**: Unlimited (stateless JWT)
- **Requests**: Render free tier limits
- **Database**: 1GB storage (Render free tier)
- **AI API**: Hugging Face rate limits

### Scaling Strategy
1. **Horizontal Scaling**: Add more Render instances
2. **Database Upgrade**: Increase PostgreSQL tier
3. **CDN**: Already global (Vercel)
4. **Caching**: Add Redis for future optimization

---

## 🔮 Future Enhancements

### Planned Features
- [ ] Redis caching for faster responses
- [ ] Background job queue (BullMQ)
- [ ] PDF/Document upload support
- [ ] Summary export (PDF, Word)
- [ ] Advanced analytics dashboard
- [ ] Multi-language support
- [ ] Custom summary length
- [ ] Batch processing
- [ ] API rate limiting
- [ ] User roles & permissions

### Infrastructure Improvements
- [ ] Prometheus + Grafana monitoring
- [ ] ELK stack for log aggregation
- [ ] Sentry for error tracking
- [ ] Automated testing (Jest, Cypress)
- [ ] Load balancing
- [ ] Database replication

---

## 📞 Support & Maintenance

### Backup Strategy
- **Database**: Render automatic daily backups
- **Code**: GitHub repository
- **Environment**: Documented in .env.example

### Disaster Recovery
1. Restore database from Render backup
2. Redeploy from GitHub
3. Update environment variables
4. Run migrations if needed

---

**Architecture designed for production deployment with scalability in mind!** 🚀

*Last Updated: November 6, 2024*
