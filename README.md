# 🎮 GLearnPlatform — AI-Enabled Gamified Learning Platform

A comprehensive full-stack MERN application featuring real-time XP tracking, badges, leaderboards, streaks, interactive quizzes, Socket.io updates, and role-based dashboards for Students, Educators, and Admins.

---

## ⚡ Quick Start

**For detailed setup instructions, see [SETUP_GUIDE.md](./SETUP_GUIDE.md)**

### Windows Users - Automated Setup

1. Ensure MongoDB is running
2. Run `setup.bat` to install dependencies and seed database
3. Run `start.bat` to start both servers

### Manual Setup

\`\`\`bash
# Server setup
cd server
npm install
npm run seed
npm run dev

# Client setup (new terminal)
cd client
npm install
npm run dev
\`\`\`

**Access:** Frontend: http://localhost:5173 | Backend: http://localhost:5000 | API Docs: http://localhost:5000/api/docs

**Test Login:** alex@example.com / student123

---

## 🌟 Features Summary

### For Students
- 🎯 Earn XP for completing lessons and quizzes
- 🏆 Unlock badges across 5 tiers (Bronze to Diamond)
- 📊 Compete on real-time leaderboards
- 🔥 Maintain daily streaks for bonus rewards
- ⚡ Real-time XP updates via WebSockets
- 📚 Browse and enroll in courses
- 🎓 Track progress and achievements

### For Educators
- 📝 Create and manage courses
- 🎬 Build lessons with multimedia content
- ✅ Design quizzes with auto-grading
- 📈 View student analytics and insights

### For Admins
- 👥 Manage users and permissions
- 📊 Access platform-wide analytics
- 🔧 System configuration

---

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 18, Vite 5, Tailwind CSS 3, Framer Motion, Chart.js |
| Backend | Node.js, Express.js 4, Socket.io 4 |
| Database | MongoDB 7 + Mongoose 8 |
| Auth | JWT + bcrypt with auto-refresh |
| API Docs | Swagger UI (`/api/docs`) |
| Real-time | WebSockets for live XP/leaderboard |

---

## Project Structure

```
platform/
├── server/          # Express.js API
│   ├── seeds/       # Seed data (users, courses, badges)
│   └── src/
│       ├── config/  # DB + Swagger
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/     # Badge + Email services
│       └── socket/       # Socket.io events
└── client/          # React + Vite frontend
    └── src/
        ├── components/
        │   ├── gamification/   # AchievementPopup, BadgeCard, LeaderboardCard
        │   ├── layout/         # DashboardLayout, Sidebar, Topbar
        │   └── ui/             # ProtectedRoute, CourseCard
        ├── context/    # AuthContext, ThemeContext
        ├── pages/
        │   ├── admin/
        │   ├── educator/
        │   └── student/
        ├── services/   # Axios API client + Socket.io client
        └── utils/
```

---

## Prerequisites

- Node.js >= 18
- MongoDB running locally on port `27017`
- (Optional) SMTP credentials for email notifications

---

## Setup & Run

### 1. Clone and Install

```bash
# Install server dependencies
cd platform/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 2. Configure Environment

```bash
cd platform/server
cp .env.example .env
```

Edit `.env`:

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/gamified_learning
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:5173

# Optional — email notifications
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your@gmail.com
EMAIL_PASS=your_app_password
```

### 3. Seed the Database (Optional)

Populates badges, test users, courses, lessons, and quizzes:

```bash
cd platform/server
npm run seed
```

**Test accounts created by seed:**

| Role | Email | Password |
|---|---|---|
| Admin | admin@glearnplatform.com | admin123 |
| Educator | educator@glearnplatform.com | educator123 |
| Student | alex@example.com | student123 |
| Student | sam@example.com | student123 |

### 4. Start Development Servers

**Terminal 1 — Backend:**
```bash
cd platform/server
npm run dev
```
API runs at `http://localhost:5000`  
Swagger docs at `http://localhost:5000/api/docs`

**Terminal 2 — Frontend:**
```bash
cd platform/client
npm run dev
```
App runs at `http://localhost:5173`

---

## Features

### Gamification
- **XP System** — earn XP by completing lessons and quizzes; auto level-up every 1000 XP
- **Badges** — tiered badges (Bronze → Diamond) with criteria: XP threshold, streak length, courses/lessons completed, points earned
- **Streaks** — daily learning streaks with longest-streak tracking
- **Leaderboard** — global leaderboard, real-time updates via Socket.io
- **Points** — separate points system for purchases and achievements

### Student Features
- Dashboard with XP progress, stats, charts, streak widget, AI recommendations
- Course catalog with search, filter, enroll
- Interactive quiz with countdown timer, per-question navigation, result review
- Lesson viewer with completion tracking
- Badges collection page with tier breakdown
- Profile editor (name, bio, difficulty preference, password)
- Discussion forums per course

### Educator Features
- Educator dashboard with course performance charts
- Course creation/editing (title, description, category, level, price, tags, requirements, objectives)
- Lesson editor (video/text/mixed content, resources, XP reward)
- Quiz builder (MCQ, per-question points, explanations, passing score, time limit)
- Student insights with enrollment vs completion charts and top students

### Admin Features
- Platform-wide stats (users, courses, attempts, badges awarded)
- Growth chart (new users/courses per month)
- User management (search, role change, activate/deactivate, delete) with pagination
- Course management (search, publish/unpublish, delete) with pagination

### Real-time (Socket.io)
- Join course/user rooms on login
- `leaderboard:update` — broadcast on quiz submission
- `discussion:new` — broadcast on new discussion post
- `challenge:send` / `challenge:received` — peer challenge system

---

## API Endpoints Overview

| Resource | Base Path |
|---|---|
| Auth | `/api/auth` |
| Courses | `/api/courses` |
| Lessons | `/api/lessons` |
| Quizzes | `/api/quizzes` |
| Badges | `/api/badges` |
| Leaderboard | `/api/leaderboard` |
| Discussions | `/api/discussions` |
| Analytics | `/api/analytics` |
| Admin | `/api/admin` |
| Users | `/api/users` |

Full interactive documentation: `http://localhost:5000/api/docs`

---

## Scripts

| Directory | Command | Description |
|---|---|---|
| `server/` | `npm run dev` | Start with nodemon |
| `server/` | `npm start` | Production start |
| `server/` | `npm run seed` | Seed database |
| `client/` | `npm run dev` | Vite dev server |
| `client/` | `npm run build` | Production build |
| `client/` | `npm run preview` | Preview production build |

---

## License

MIT
