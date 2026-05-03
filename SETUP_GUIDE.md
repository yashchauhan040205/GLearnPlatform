# 🎮 GLearn Platform - Gamified Learning Platform

A comprehensive AI-enabled gamified learning platform with XP rewards, leaderboards, badges, and real-time features.

## 🌟 Features

### For Students
- **Course Discovery**: Browse and enroll in courses across multiple categories
- **Interactive Learning**: Access lessons with video, text content, and resources
- **Gamification System**:
  - 🎯 Earn XP for completing lessons and quizzes
  - 🔥 Maintain daily streaks for bonus rewards
  - 🏆 Unlock badges for achievements
  - 📊 Track progress on leaderboards
  - ⚡ Real-time XP updates via WebSockets
- **Quiz System**: Test knowledge with interactive quizzes
- **Progress Tracking**: Monitor completed lessons, courses, and achievements
- **Social Features**: Discussion boards and collaborative learning

### For Educators
- **Course Management**: Create and manage courses with modules
- **Lesson Editor**: Rich content creation with multimedia support
- **Quiz Builder**: Create assessments with multiple question types
- **Student Analytics**: Track student progress and engagement
- **Performance Insights**: View detailed analytics and reports

### For Admins
- **User Management**: Manage students, educators, and permissions
- **Course Oversight**: Monitor and moderate all courses
- **System Analytics**: Platform-wide statistics and metrics

## 🚀 Tech Stack

### Frontend
- **React 18** with Vite for fast development
- **Tailwind CSS** for modern, responsive UI
- **Framer Motion** for smooth animations
- **React Router** for navigation
- **Socket.io Client** for real-time updates
- **Axios** for API requests
- **React Hot Toast** for notifications
- **Chart.js** for data visualization

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Socket.io** for WebSocket connections
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Swagger** for API documentation

## 📋 Prerequisites

- **Node.js** (v16 or higher)
- **MongoDB** (v5 or higher) - running locally or MongoDB Atlas
- **npm** or **yarn** package manager

## 🛠️ Installation & Setup

### 1. Clone the Repository

\`\`\`bash
git clone <repository-url>
cd platform
\`\`\`

### 2. Server Setup

\`\`\`bash
cd server

# Install dependencies
npm install

# Configure environment variables
# The .env file is already created with default values
# Edit server/.env if you need custom configuration

# Start MongoDB (if running locally)
# Make sure MongoDB is running on mongodb://localhost:27017

# Seed the database with sample data
npm run seed

# Start the development server
npm run dev
\`\`\`

The server will start on **http://localhost:5000**

### 3. Client Setup

Open a new terminal:

\`\`\`bash
cd client

# Install dependencies
npm install

# Start the development server
npm run dev
\`\`\`

The client will start on **http://localhost:5173**

## 👥 Test Accounts

After seeding the database, you can log in with these accounts:

### Admin Account
- **Email**: admin@glearnplatform.com
- **Password**: admin123
- **Features**: Full system access, user management, analytics

### Educator Account
- **Email**: educator@glearnplatform.com
- **Password**: educator123
- **Features**: Course creation, lesson management, student insights

### Student Accounts
- **Email**: alex@example.com / **Password**: student123 (Mid-level with some progress)
- **Email**: sam@example.com / **Password**: student123 (Top-ranked student)
- **Email**: maya@example.com / **Password**: student123
- **Email**: jordan@example.com / **Password**: student123
- **Email**: riley@example.com / **Password**: student123

## 🎯 Student Learning Flow

### 1. Authentication & Token Management
- Students log in and receive a JWT token
- Token is automatically refreshed on each login
- Real-time socket connection is established
- Streak tracking begins automatically

### 2. Course Discovery
- Browse all available courses
- Filter by category, difficulty level
- Search courses by title or description
- View course details including lessons and XP rewards

### 3. Course Enrollment
- Enroll in courses with one click
- Courses are added to "My Courses"
- Progress tracking begins immediately

### 4. Learning Journey
- Access course chapters (lessons) in order
- Complete lessons to earn XP and points
- Watch videos, read content, access resources
- Mark lessons as complete

### 5. XP & Rewards System
- **Earn XP** for:
  - Completing lessons (50-150 XP per lesson)
  - Passing quizzes (100-200 XP per quiz)
  - Completing entire courses (500-3000 XP bonus)
- **Level Up**: Every 1000 XP = 1 Level
- **Real-time Updates**: XP gains appear instantly via WebSockets
- **Streak Bonuses**: Daily login streaks multiply rewards

### 6. Badges & Achievements
- **Bronze Badges**: First lesson, 500 XP milestone
- **Silver Badges**: 7-day streak, first course completion
- **Gold Badges**: 5000 XP, 30-day streak
- **Platinum Badges**: 5 courses completed
- **Diamond Badges**: 25000 XP milestone

Badges are automatically awarded when criteria are met.

### 7. Leaderboard Competition
- **Global Leaderboard**: Top students by total XP
- **Real-time Updates**: Rankings update live as students earn XP
- **Top 3 Podium**: Special display for top performers
- **Your Rank**: Always visible to track progress

### 8. Quizzes & Assessments
- Take quizzes after lessons
- Multiple attempts allowed (configurable)
- Instant feedback with explanations
- XP awarded based on performance

## 🔧 Environment Configuration

### Server Environment Variables (server/.env)

\`\`\`env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGO_URI=mongodb://localhost:27017/gamified_learning

# JWT Configuration  
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRE=7d

# Client URL
CLIENT_URL=http://localhost:5173

# Email Configuration (Optional)
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASSWORD=your_app_password
EMAIL_FROM=noreply@gamifiedlearning.com
\`\`\`

## 📡 API Documentation

Once the server is running, access the Swagger API documentation at:

**http://localhost:5000/api/docs**

### Key API Endpoints

#### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login (generates fresh token)
- `GET /api/auth/me` - Get current user
- `POST /api/auth/refresh` - Refresh JWT token

#### Courses
- `GET /api/courses` - List all courses
- `GET /api/courses/:id` - Get course details
- `POST /api/courses/:id/enroll` - Enroll in course

#### Lessons
- `GET /api/lessons/course/:courseId` - Get course lessons
- `GET /api/lessons/:id` - Get lesson details
- `POST /api/lessons/:id/complete` - Mark lesson complete (awards XP)

#### Quizzes
- `GET /api/quizzes/course/:courseId` - Get course quizzes
- `POST /api/quizzes/:id/submit` - Submit quiz attempt

#### Leaderboard
- `GET /api/leaderboard` - Get global leaderboard

#### Badges
- `GET /api/badges` - Get all badges with earned status

## 🎮 Gamification System Details

### XP Calculation
- **Lesson Completion**: 50-150 XP (based on difficulty)
- **Quiz Pass**: 100-200 XP (70%+ required)
- **Quiz Fail**: 30% of potential XP
- **Course Completion**: Bonus 500-3000 XP
- **Badge Unlock**: Bonus 100-5000 XP

### Level System
\`\`\`
Level = floor(Total XP / 1000) + 1

Example:
- 0-999 XP = Level 1
- 1000-1999 XP = Level 2
- 5000-5999 XP = Level 6
\`\`\`

### Streak System
- Login daily to maintain streak
- Miss a day = streak resets to 1
- Longest streak is tracked permanently
- Streak badges at 7, 30, 60 days

## 🔮 Real-time Features

### WebSocket Events

**Client → Server:**
- `join:user` - Join personal notification room
- `join:leaderboard` - Join leaderboard updates
- `join:course` - Join course discussion room

**Server → Client:**
- `xp:update` - Real-time XP/level updates
- `leaderboard:update` - Leaderboard changes
- `discussion:new` - New discussion posts
- `challenge:received` - Peer challenges

## 📦 Database Schema

### User Model
- Profile: name, email, avatar, bio
- Gamification: xp, level, points, badges
- Progress: enrolledCourses, completedCourses, completedLessons
- Streak: streak, longestStreak, lastActivity

### Course Model
- Metadata: title, description, category, difficulty
- Content: modules (lessons), tags
- Gamification: xpReward, pointsReward
- Stats: rating, enrolledStudents

### Lesson Model
- Content: title, content, videoUrl, resources
- Metadata: order, duration, difficulty
- Rewards: xpReward, pointsReward

### Badge Model
- Display: name, icon, color, tier
- Criteria: type (xp/streak/courses), threshold
- Rewards: xpReward, pointsReward

## 🧪 Testing the Application

### Test Student Flow

1. **Login** as alex@example.com / student123
2. **Browse Courses** → Navigate to "Explore Courses"
3. **Enroll** in "Complete Web Development Bootcamp"
4. **Start Learning** → Click on first lesson
5. **Complete Lesson** → Click "Mark Complete" button
6. **Observe**:
   - XP toast notification appears
   - User XP updates in header
   - Potential badge unlock popup
   - Leaderboard position changes (if applicable)
7. **Check Leaderboard** → See real-time rankings
8. **View Badges** → Check earned and locked badges
9. **Take Quiz** → Test knowledge and earn more XP

## 🚧 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running: \`mongod\`
- Check MONGO_URI in server/.env
- For MongoDB Atlas, use connection string with credentials

### Port Already in Use
- Server (5000): Change PORT in server/.env
- Client (5173): Change port in client/vite.config.js

### Socket Connection Fails
- Ensure server is running before client
- Check CLIENT_URL in server/.env matches client port
- Check browser console for WebSocket errors

### XP Not Updating
- Check browser console for socket connection
- Verify server logs show socket connections
- Ensure user is logged in and token is valid

## 📚 Additional Scripts

### Server
\`\`\`bash
npm start        # Production mode
npm run dev      # Development with nodemon
npm run seed     # Seed database
\`\`\`

### Client
\`\`\`bash
npm run dev      # Development server
npm run build    # Production build
npm run preview  # Preview production build
\`\`\`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🎓 Learning Path Recommendation

For new students:
1. Start with "Complete Web Development Bootcamp" (Beginner)
2. Progress to "UI/UX Design Fundamentals" (Beginner)
3. Advance to "Data Structures & Algorithms" (Intermediate)
4. Master "Machine Learning with Python" (Intermediate)

## 🔐 Security Notes

- **Production Deployment**: 
  - Change JWT_SECRET to a strong random string
  - Use HTTPS for all communications
  - Enable CORS only for trusted domains
  - Use environment-specific .env files
  - Never commit .env files to version control

## 📞 Support

For issues, questions, or contributions:
- Open an issue on GitHub
- Check API documentation at /api/docs
- Review code comments for implementation details

---

**Happy Learning! 🎓✨**
