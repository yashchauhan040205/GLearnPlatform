import { useState, useEffect } from 'react'
import { Search, BookOpen } from 'lucide-react'
import CourseCard from '../../components/ui/CourseCard'
import api from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const categories = ['All', 'Web Development', 'Machine Learning', 'Computer Science', 'Design', 'Mobile', 'Data Science']
const difficulties = ['All', 'beginner', 'intermediate', 'advanced']

const Courses = () => {
  const { user } = useAuth()
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('All')
  const [difficulty, setDifficulty] = useState('All')
  const [page, setPage] = useState(1)
  const [total, setTotal] = useState(0)

  useEffect(() => {
    const fetch = async () => {
      setLoading(true)
      try {
        const params = { page, limit: 12 }
        if (category !== 'All') params.category = category
        if (difficulty !== 'All') params.difficulty = difficulty
        const { data } = await api.get('/courses', { params })
        setCourses(data.courses || [])
        setTotal(data.total || 0)
      } catch (_) {} finally { setLoading(false) }
    }
    fetch()
  }, [category, difficulty, page])

  const filtered = search ? courses.filter(c => c.title.toLowerCase().includes(search.toLowerCase()) || c.description?.toLowerCase().includes(search.toLowerCase())) : courses

  return (
    <div className="space-y-5 animate-in">
      <div>
        <h1 className="text-xl font-bold text-gray-100">Courses</h1>
        <p className="text-gray-400 text-sm mt-0.5">{total} courses available</p>
      </div>

      {/* Filters */}
      <div className="card p-3">
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-dark-500" />
            <input value={search} onChange={e => setSearch(e.target.value)} className="input pl-8 text-sm" placeholder="Search courses..." />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setPage(1) }} className="input sm:w-44 text-sm">
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <select value={difficulty} onChange={e => { setDifficulty(e.target.value); setPage(1) }} className="input sm:w-36 text-sm">
            {difficulties.map(d => <option key={d} value={d} className="capitalize">{d === 'All' ? 'All Levels' : d}</option>)}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="h-36 bg-gray-950 rounded-lg mb-3" />
              <div className="h-4 bg-gray-950 rounded mb-2" />
              <div className="h-3 bg-gray-950 rounded w-3/4" />
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <BookOpen size={40} className="text-dark-500 mx-auto mb-3" />
          <p className="text-gray-400">No courses found</p>
          <p className="text-dark-500 text-sm mt-1">Try adjusting filters</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {filtered.map((course, i) => (
            <CourseCard key={course._id} course={course} isEnrolled={user?.enrolledCourses?.includes(course._id)} index={i} />
          ))}
        </div>
      )}

      {total > 12 && (
        <div className="flex justify-center gap-2">
          <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-secondary py-1.5 px-3 text-sm">Prev</button>
          <span className="flex items-center text-gray-400 text-sm">Page {page}</span>
          <button onClick={() => setPage(p => p + 1)} disabled={courses.length < 12} className="btn-secondary py-1.5 px-3 text-sm">Next</button>
        </div>
      )}
    </div>
  )
}

export default Courses
