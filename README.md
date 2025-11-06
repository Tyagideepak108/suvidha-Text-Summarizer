# 📝 Suvidha Text Summarizer

AI-powered text summarization application built with Next.js, Express.js, PostgreSQL, and Redis. Generate concise summaries of long texts using advanced NLP models.

![Next.js](https://img.shields.io/badge/Next.js-16.0-black)
![Node.js](https://img.shields.io/badge/Node.js-20+-green)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue)
![Redis](https://img.shields.io/badge/Redis-7-red)

## ✨ Features

- 🤖 **AI-Powered Summarization** - Uses Hugging Face's BART model for accurate text summarization
- 🔐 **User Authentication** - Secure JWT-based authentication with email/password
- 👤 **User Profile** - Avatar with first letter of email, personalized dashboard
- 📊 **Summary History** - View and manage all your past summaries
- 🗑️ **Delete Summaries** - Remove unwanted summaries with confirmation
- ⚡ **Fast Processing** - Direct summarization with optional Redis caching
- 🎨 **Modern UI** - Clean, responsive design with Tailwind CSS
- ✅ **Form Validation** - Email format and password strength validation
- 🔄 **Real-time Updates** - Instant feedback on all operations

## 🏗️ Architecture

```
suvidha-text-summarizer/
├── frontend/          # Next.js 16 application
│   ├── app/          # App router pages
│   ├── components/   # Reusable components
│   ├── lib/          # Axios configuration
│   └── services/     # API service layer
├── backend/          # Express.js API server
│   ├── routes/       # API routes
│   ├── models/       # Sequelize models
│   ├── middleware/   # Auth & cache middleware
│   ├── config/       # Database & Redis config
│   └── workers/      # Background job workers
└── docker-compose.yml # Docker orchestration
```

## 🚀 Tech Stack

### Frontend
- **Framework:** Next.js 16 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **HTTP Client:** Axios
- **Authentication:** NextAuth.js

### Backend
- **Runtime:** Node.js 20+
- **Framework:** Express.js
- **Database:** PostgreSQL 15
- **ORM:** Sequelize
- **Cache:** Redis 7
- **Queue:** BullMQ
- **AI Model:** Hugging Face Inference API

## 📋 Prerequisites

- Node.js 20 or higher
- PostgreSQL 15
- Redis 7
- Hugging Face API Key
- Git

## 🛠️ Installation

### 1. Clone Repository

```bash
git clone https://github.com/Tyagideepak108/suvidha-Text-Summarizer.git
cd suvidha-Text-Summarizer
```

### 2. Backend Setup

```bash
cd backend
npm install

# Create .env file
cat > .env << EOF
PORT=3002
HUGGINGFACE_API_KEY=your_huggingface_api_key
JWT_SECRET=suvidha_secret_key
POSTGRES_USER=postgres
POSTGRES_PASSWORD=postgres123
POSTGRES_DB=suvidha_db
DB_HOST=localhost
DB_PORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
EOF

# Run migrations
npx sequelize-cli db:migrate

# Start backend
npm run dev
```

### 3. Frontend Setup

```bash
cd frontend
npm install

# Create .env.local file
cat > .env.local << EOF
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=suvidha-text-summarizer-secret-key-2024-production
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
EOF

# Start frontend
npm run dev
```

### 4. Database Setup

```bash
# Start PostgreSQL
# Windows: Start PostgreSQL service
# Linux/Mac: sudo service postgresql start

# Create database
psql -U postgres
CREATE DATABASE suvidha_db;
\q
```

### 5. Redis Setup

```bash
# Start Redis
# Windows: redis-server
# Linux/Mac: sudo service redis-server start
```

## 🐳 Docker Setup

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

## 📱 Usage

1. **Sign Up:** Create account with email and password
2. **Login:** Access your dashboard
3. **Summarize:** Enter text and generate summary
4. **History:** View all your summaries
5. **Delete:** Remove unwanted summaries
6. **Logout:** Secure logout

## 🔑 Environment Variables

### Backend (.env)
```env
PORT=3002
HUGGINGFACE_API_KEY=your_key
JWT_SECRET=your_secret
POSTGRES_USER=postgres
POSTGRES_PASSWORD=password
POSTGRES_DB=suvidha_db
DB_HOST=localhost
DB_PORT=5432
REDIS_HOST=localhost
REDIS_PORT=6379
```

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_URL=http://localhost:3002
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret
GOOGLE_CLIENT_ID=optional
GOOGLE_CLIENT_SECRET=optional
GITHUB_CLIENT_ID=optional
GITHUB_CLIENT_SECRET=optional
```

## 🌐 Deployment

### Vercel (Frontend)

```bash
cd frontend
vercel
```

Add environment variables in Vercel dashboard.

### Render (Backend)

1. Connect GitHub repository
2. Set root directory: `backend`
3. Build command: `npm install`
4. Start command: `node index.js`
5. Add environment variables
6. Add PostgreSQL and Redis add-ons

## 📚 API Endpoints

### Authentication
- `POST /auth/signup` - Create new account
- `POST /auth/login` - Login user
- `POST /auth/oauth-login` - OAuth login

### Summaries
- `POST /summaries` - Generate summary
- `GET /summaries` - Get all summaries
- `DELETE /summaries/:id` - Delete summary
- `GET /summaries/job/:jobId` - Get job status

## 🧪 Testing

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📝 License

This project is licensed under the MIT License.

## 👨‍💻 Author

**Deepak Tyagi**
- GitHub: [@Tyagideepak108](https://github.com/Tyagideepak108)

## 🙏 Acknowledgments

- Hugging Face for AI models
- Next.js team for amazing framework
- Express.js community
- PostgreSQL & Redis teams

## 📞 Support

For support, email tyagideepak1007@gmail.com or create an issue.

## 🔮 Future Enhancements

- [ ] Multiple language support
- [ ] PDF/Document upload
- [ ] Summary export (PDF, Word)
- [ ] Summary sharing
- [ ] Advanced analytics
- [ ] Custom summary length
- [ ] Batch processing
- [ ] API rate limiting
- [ ] User roles & permissions
- [ ] Dark mode

---

Made with ❤️ by Deepak Tyagi
