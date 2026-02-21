import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'

// Student pages
import StudentDashboard from './pages/student/Dashboard'
import Courses from './pages/student/Courses'
import CourseDetail from './pages/student/CourseDetail'
import LessonView from './pages/student/LessonView'
import QuizPage from './pages/student/QuizPage'
import Leaderboard from './pages/student/Leaderboard'
import Badges from './pages/student/Badges'
import Profile from './pages/student/Profile'
import Discussions from './pages/student/Discussions'

// Educator pages
import EducatorDashboard from './pages/educator/Dashboard'
import ManageCourses from './pages/educator/ManageCourses'
import CourseEditor from './pages/educator/CourseEditor'
import LessonEditor from './pages/educator/LessonEditor'
import QuizEditor from './pages/educator/QuizEditor'
import StudentInsights from './pages/educator/StudentInsights'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminCourses from './pages/admin/AdminCourses'

import LandingPage from './pages/LandingPage'

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen bg-dark-900">
            <Toaster
              position="top-right"
              toastOptions={{
                style: { background: '#1e293b', color: '#e2e8f0', border: '1px solid #334155' },
                success: { iconTheme: { primary: '#10b981', secondary: '#1e293b' } },
                error: { iconTheme: { primary: '#ef4444', secondary: '#1e293b' } },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Student routes */}
              <Route path="/student" element={<ProtectedRoute role="student"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<StudentDashboard />} />
                <Route path="courses" element={<Courses />} />
                <Route path="courses/:id" element={<CourseDetail />} />
                <Route path="lessons/:id" element={<LessonView />} />
                <Route path="quiz/:id" element={<QuizPage />} />
                <Route path="leaderboard" element={<Leaderboard />} />
                <Route path="badges" element={<Badges />} />
                <Route path="profile" element={<Profile />} />
                <Route path="discussions/:courseId" element={<Discussions />} />
              </Route>

              {/* Educator routes */}
              <Route path="/educator" element={<ProtectedRoute role="educator"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<EducatorDashboard />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/new" element={<CourseEditor />} />
                <Route path="courses/:id/edit" element={<CourseEditor />} />
                <Route path="courses/:courseId/lessons/new" element={<LessonEditor />} />
                <Route path="lessons/:id/edit" element={<LessonEditor />} />
                <Route path="courses/:courseId/quiz/new" element={<QuizEditor />} />
                <Route path="insights" element={<StudentInsights />} />
              </Route>

              {/* Admin routes */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="courses" element={<AdminCourses />} />
              </Route>

              {/* Catch all */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App
