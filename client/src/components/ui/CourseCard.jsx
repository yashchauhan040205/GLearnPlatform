import { useNavigate } from 'react-router-dom'
import { BookOpen, Star, Users, Clock, Zap } from 'lucide-react'
import { getDifficultyColor, formatDuration, getAvatarUrl } from '../../utils/helpers'

const CourseCard = ({ course, isEnrolled = false, index = 0 }) => {
  const navigate = useNavigate()

  return (
    <div
      onClick={() => navigate(`/student/courses/${course._id}`)}
      className="card-hover group overflow-hidden"
    >
      {/* Thumbnail */}
      <div className="relative h-36 bg-dark-900/80 rounded-xl mb-3 overflow-hidden">
        {course.thumbnail ? (
          <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <BookOpen size={32} className="text-dark-500" />
          </div>
        )}
        {isEnrolled && (
          <div className="absolute top-2 right-2 bg-emerald-500 text-white text-xs px-2 py-0.5 rounded font-medium">
            Enrolled
          </div>
        )}
        <div className="absolute bottom-2 left-2">
          <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getDifficultyColor(course.difficulty)}`}>
            {course.difficulty}
          </span>
        </div>
      </div>

      <h3 className="text-dark-100 font-semibold text-sm mb-1 group-hover:text-primary-400 transition-colors line-clamp-2">
        {course.title}
      </h3>
      <p className="text-dark-400 text-xs mb-2 line-clamp-2">{course.description}</p>

      {course.educator && (
        <div className="flex items-center gap-2 mb-2">
          <img src={course.educator.avatar || getAvatarUrl(course.educator.name, 24)} alt="" className="w-4 h-4 rounded-full" />
          <span className="text-dark-500 text-xs">{course.educator.name}</span>
        </div>
      )}

      <div className="flex items-center gap-3 text-xs text-dark-500 mb-2">
        <span className="flex items-center gap-1"><Star size={11} className="text-amber-400 fill-amber-400" />{course.rating?.toFixed(1) || 0}</span>
        <span className="flex items-center gap-1"><Users size={11} />{course.enrolledStudents?.length || 0}</span>
        {course.duration > 0 && <span className="flex items-center gap-1"><Clock size={11} />{formatDuration(course.duration)}</span>}
      </div>

      <div className="flex items-center justify-between pt-2 border-t border-dark-700">
        <div className="flex items-center gap-1 text-xs text-primary-400">
          <Zap size={11} /> +{course.xpReward} XP
        </div>
        <span className="text-xs text-dark-500 bg-dark-950 px-2 py-0.5 rounded">{course.category}</span>
      </div>
    </div>
  )
}

export default CourseCard
