import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import { ThemeProvider } from './context/ThemeContext'
import ProtectedRoute from './components/ui/ProtectedRoute'
import DashboardLayout from './components/layout/DashboardLayout'

// Auth pages
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import VerifyEmail from './pages/auth/VerifyEmail'

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

// Educator pages (view-only, no creation)
import EducatorDashboard from './pages/educator/Dashboard'
import ManageCourses from './pages/educator/ManageCourses'
import StudentInsights from './pages/educator/StudentInsights'

// Admin pages
import AdminDashboard from './pages/admin/Dashboard'
import ManageUsers from './pages/admin/ManageUsers'
import AdminCourses from './pages/admin/AdminCourses'
import AdminCourseEditor from './pages/admin/CourseEditor'
import AdminLessonEditor from './pages/admin/LessonEditor'
import AdminQuizEditor from './pages/admin/QuizEditor'

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
                style: { background: '#fff', color: '#212529', border: '1px solid #dee2e6', boxShadow: '0 1px 3px rgba(0,0,0,0.08)' },
                success: { iconTheme: { primary: '#2f9e44', secondary: '#fff' } },
                error: { iconTheme: { primary: '#e03131', secondary: '#fff' } },
              }}
            />
            <Routes>
              {/* Public routes */}
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-email" element={<VerifyEmail />} />

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

              {/* Educator routes (can now create/edit/delete their own courses) */}
              <Route path="/educator" element={<ProtectedRoute role="educator"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<EducatorDashboard />} />
                <Route path="courses" element={<ManageCourses />} />
                <Route path="courses/new" element={<AdminCourseEditor />} />
                <Route path="courses/:id/edit" element={<AdminCourseEditor />} />
                <Route path="courses/:courseId/lessons/new" element={<AdminLessonEditor />} />
                <Route path="lessons/:id/edit" element={<AdminLessonEditor />} />
                <Route path="courses/:courseId/quiz/new" element={<AdminQuizEditor />} />
                <Route path="insights" element={<StudentInsights />} />
              </Route>

              {/* Admin routes (full control — create, edit, delete courses/quizzes/lessons) */}
              <Route path="/admin" element={<ProtectedRoute role="admin"><DashboardLayout /></ProtectedRoute>}>
                <Route index element={<AdminDashboard />} />
                <Route path="users" element={<ManageUsers />} />
                <Route path="courses" element={<AdminCourses />} />
                <Route path="courses/new" element={<AdminCourseEditor />} />
                <Route path="courses/:id/edit" element={<AdminCourseEditor />} />
                <Route path="courses/:courseId/lessons/new" element={<AdminLessonEditor />} />
                <Route path="lessons/:id/edit" element={<AdminLessonEditor />} />
                <Route path="courses/:courseId/quiz/new" element={<AdminQuizEditor />} />
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
