# 🚀 Quick Reference Card - GLearn Platform

## 📦 Installation (One-time Setup)

### Windows Quick Start
\`\`\`bash
# 1. Ensure MongoDB is running
# 2. Run setup
setup.bat

# 3. Start servers
start.bat
\`\`\`

### Manual Setup
\`\`\`bash
# Server
cd server
npm install
npm run seed
npm run dev

# Client (new terminal)
cd client
npm install
npm run dev
\`\`\`

---

## 🔐 Test Accounts

| Email | Password | Role | XP | Level |
|-------|----------|------|-----|-------|
| alex@example.com | student123 | Student | 8,500 | 9 |
| sam@example.com | student123 | Student | 18,500 | 19 |
| educator@glearnplatform.com | educator123 | Educator | - | - |
| admin@glearnplatform.com | admin123 | Admin | - | - |

---

## 🌐 Access Points

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| API Docs | http://localhost:5000/api/docs |
| MongoDB | mongodb://localhost:27017 |

---

## 🎯 Key Features

### For Students

**1. Course Learning**
- Browse 4 sample courses
- Filter by category/difficulty
- Enroll with one click
- Complete 5 lessons
- Earn 50-150 XP per lesson

**2. XP System**
- Complete lessons → Earn XP
- Pass quizzes → Bonus XP
- Complete courses → 500-3000 XP
- Level up every 1000 XP
- Real-time notifications ⚡

**3. Badges** (8 total)
- 🥉 Bronze: First Steps, Knowledge Seeker
- 🥈 Silver: Week Warrior, Course Champion
- 🥇 Gold: XP Master, Marathon Learner
- 💍 Platinum: Polymath
- 💎 Diamond: Legend

**4. Leaderboard**
- Top 20 global rankings
- Real-time updates
- Your rank always visible
- Top 3 podium display

**5. Streaks**
- Daily login tracking
- Consecutive day counting
- Streak badges (7, 30 days)
- Visual flame indicator 🔥

---

## 🎮 Quick Student Flow

\`\`\`
Login → Browse Courses → Enroll → Start Lesson
  ↓
Complete Lesson → Earn XP (+50-150) → Badge? → Next Lesson
  ↓
Take Quiz → Pass (70%+) → Earn XP (+100-200)
  ↓
Complete Course → Bonus XP (+500-3000)
  ↓
Check Leaderboard → See Your Rank ↗️
\`\`\`

---

## ✅ Feature Checklist

- ✅ JWT Authentication (7-day tokens)
- ✅ Token auto-refresh
- ✅ Course enrollment
- ✅ Lesson completion
- ✅ XP earning system
- ✅ Real-time XP updates (Socket.io)
- ✅ Badge auto-awarding
- ✅ Leaderboard rankings
- ✅ Streak tracking
- ✅ Quiz system
- ✅ Progress tracking
- ✅ Beautiful UI with animations

---

## 🔧 Common Commands

### Server
\`\`\`bash
cd server
npm run dev      # Start dev server
npm run seed     # Reseed database
npm start        # Production mode
\`\`\`

### Client
\`\`\`bash
cd client
npm run dev      # Start dev server
npm run build    # Production build
npm run preview  # Preview build
\`\`\`

### Database
\`\`\`bash
mongod                    # Start MongoDB
mongo                     # Open MongoDB shell
use gamified_learning     # Select database
db.users.find()          # View users
\`\`\`

---

## 📊 XP Rewards Reference

| Action | XP | Points | Notes |
|--------|-----|--------|-------|
| Easy Lesson | 50-75 | 10-15 | Basic content |
| Medium Lesson | 75-100 | 15-20 | Intermediate |
| Hard Lesson | 100-150 | 20-30 | Advanced |
| Quiz Pass | 100-200 | 25-40 | 70%+ required |
| Quiz Fail | 30-60 | 0 | 30% of XP |
| Course Complete | 500-3000 | 100-750 | Bonus |
| Badge Unlock | 100-5000 | 25-1500 | Tier-based |

**Level Formula:** Level = floor(XP / 1000) + 1

---

## 🏆 Badge Unlock Criteria

| Badge | Criteria | XP Bonus |
|-------|----------|----------|
| 👣 First Steps | Complete 1 lesson | +100 |
| 📚 Knowledge Seeker | Earn 500 XP | +150 |
| 🔥 Week Warrior | 7-day streak | +300 |
| 🏆 Course Champion | Complete 1 course | +500 |
| ⚡ XP Master | Earn 5000 XP | +1000 |
| 🌟 Marathon Learner | 30-day streak | +1500 |
| 🧠 Polymath | Complete 5 courses | +2500 |
| 💎 Legend | Earn 25000 XP | +5000 |

---

## 🚨 Troubleshooting

### MongoDB Not Running
\`\`\`bash
# Windows
mongod

# Check if running
tasklist | findstr mongod
\`\`\`

### Port Already in Use
\`\`\`bash
# Server: Edit server/.env → PORT=5001
# Client: Edit client/vite.config.js → port: 5174
\`\`\`

### Socket Not Connecting
1. Ensure server is running first
2. Check browser console for errors
3. Verify CLIENT_URL in server/.env
4. Clear browser cache and reload

### XP Not Updating
1. Check if logged in
2. Verify token in localStorage
3. Check browser console for socket connection
4. Refresh page and try again

---

## 📁 Key Files

### Server
- \`server/.env\` - Configuration
- \`server/src/index.js\` - Main server
- \`server/src/controllers/authController.js\` - Auth logic
- \`server/src/controllers/lessonController.js\` - XP awarding
- \`server/src/services/badgeService.js\` - Badge logic
- \`server/src/socket/index.js\` - WebSocket

### Client
- \`client/src/context/AuthContext.jsx\` - Auth state
- \`client/src/pages/student/Dashboard.jsx\` - Main view
- \`client/src/pages/student/Courses.jsx\` - Browse courses
- \`client/src/pages/student/LessonView.jsx\` - Learn
- \`client/src/pages/student/Leaderboard.jsx\` - Rankings
- \`client/src/pages/student/Badges.jsx\` - Achievements

---

## 🎓 Test Scenario

**Complete First Lesson:**
1. Login: alex@example.com / student123
2. Go to "Explore Courses"
3. Click "Complete Web Development Bootcamp"
4. Click "Start Course"
5. View lesson content
6. Click "Mark Complete"
7. Observe: XP toast, badge unlock?, rank change
8. Check leaderboard for new rank
9. View badges for unlocked achievements

---

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Detailed setup
- **[STUDENT_FLOW.md](./STUDENT_FLOW.md)** - Complete flow docs
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Technical details
- **[README.md](./README.md)** - Project overview

---

## 🎯 Next Steps

1. ✅ Run `setup.bat` (first time only)
2. ✅ Run `start.bat` to launch
3. ✅ Open http://localhost:5173
4. ✅ Login and start learning!

---

**Happy Learning! 🚀✨**

*For support, check documentation or API docs at /api/docs*
