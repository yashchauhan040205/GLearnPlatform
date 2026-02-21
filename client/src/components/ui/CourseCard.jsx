import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, Clock, Zap } from 'lucide-react'
import { getDifficultyColor, formatDuration, getAvatarUrl } from '../../utils/helpers'

const CourseCard = ({ course, isEnrolled = false, index = 0 }) => {
  const navigate = useNavigate()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      onClick={() => navigate(`/student/courses/${course._id}`)}
      className="card-hover group overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-40 bg-gradient-to-br from-primary-900/40 to-purple-900/30 rounded-lg mb-4 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={40} className="text-primary-400/50" />
          </div>
        )}
        {isEnrolled && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded-full font-medium">
            Enrolled
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs px-2 py-0.5 rounded-full border font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-white font-semibold text-sm mb-1 group-hover:text-primary-400 transition-colors line-clamp-2">
        {course.title}
      </h3>
      <p className="text-dark-400 text-xs mb-3 line-clamp-2">{course.description}</p>

      {/* Educator */}
      {course.educator && (
        <div className="flex items-center gap-2 mb-3">
          <img src={course.educator.avatar || getAvatarUrl(course.educator.name, 24)} alt="" className="w-5 h-5 rounded-full" />
          <span className="text-dark-500 text-xs">{course.educator.name}</span>
        </div>
      )}

      {/* Stats */}
      <div className="flex items-center gap-3 text-xs text-dark-500 mb-3">
        <span className="flex items-center gap-1"><Star size={12} className="text-yellow-400 fill-yellow-400" />{course.rating?.toFixed(1) || 0}</span>
        <span className="flex items-center gap-1"><Users size={12} />{course.enrolledStudents?.length || 0}</span>
        {course.duration > 0 && <span className="flex items-center gap-1"><Clock size={12} />{formatDuration(course.duration)}</span>}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-dark-700">
        <div className="flex items-center gap-1 text-xs text-primary-400">
          <Zap size={12} /> +{course.xpReward} XP
        </div>
        <span className="text-xs text-dark-500 bg-dark-700 px-2 py-1 rounded-full">{course.category}</span>
      </div>
    </motion.div>
  )
}

export default CourseCard
