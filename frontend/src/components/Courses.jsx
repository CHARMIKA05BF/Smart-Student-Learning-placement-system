import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'

const Courses = ({ user, setUser }) => {
  const [courses, setCourses] = useState([])
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [courseForm, setCourseForm] = useState({ title: '', description: '', content: '' })

  const isTrainer = user?.user?.role === 'trainer'

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch('/api/courses', {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        const data = await response.json()
        if (!response.ok) {
          setError(data.message || 'Unable to load courses')
          return
        }
        setCourses(data)
      } catch (err) {
        setError('Unable to load courses')
      }
    }

    fetchCourses()
  }, [user])

  const createCourse = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/courses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(courseForm),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Unable to create course')
        return
      }
      setCourses([data, ...courses])
      setCourseForm({ title: '', description: '', content: '' })
      setMessage('Course created successfully.')
    } catch (err) {
      setError('Unable to create course')
    }
  }

  const handleEnroll = async (courseId) => {
    setError('')
    setMessage('')

    try {
      const response = await fetch(`/api/courses/${courseId}/enroll`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Unable to enroll')
        return
      }
      setMessage('Enrolled in course successfully.')
      if (setUser) {
        const stored = localStorage.getItem('learning_user')
        if (stored) {
          const storedData = JSON.parse(stored)
          const enrolledSet = new Set(storedData.user?.enrolledCourses || [])
          enrolledSet.add(courseId)
          storedData.user.enrolledCourses = Array.from(enrolledSet)
          localStorage.setItem('learning_user', JSON.stringify(storedData))
          setUser(storedData)
        }
      }
    } catch (err) {
      setError('Unable to enroll')
    }
  }

  return (
    <main className="page-shell content-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Course catalog</p>
          <h1>Available courses</h1>
          <p>Browse learning paths and enroll from a responsive training dashboard.</p>
        </div>
      </section>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      {isTrainer && (
        <section className="form-panel">
          <h2>Create a new course</h2>
          <form onSubmit={createCourse} className="course-form">
            <label>
              Title
              <input
                type="text"
                name="title"
                value={courseForm.title}
                onChange={(e) => setCourseForm({ ...courseForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={courseForm.description}
                onChange={(e) => setCourseForm({ ...courseForm, description: e.target.value })}
                required
              />
            </label>
            <label>
              Content overview
              <textarea
                name="content"
                value={courseForm.content}
                onChange={(e) => setCourseForm({ ...courseForm, content: e.target.value })}
              />
            </label>
            <button type="submit" className="button primary">
              Create course
            </button>
          </form>
        </section>
      )}
      <section className="card-grid">
        {courses.map((course) => (
          <article key={course._id} className="course-card">
            <div>
              <h2>{course.title}</h2>
              <p>{course.description}</p>
              <p className="course-meta">Trainer: {course.trainer?.name || 'Staff'}</p>
            </div>
              <div className="course-card-actions">
                <Link to={`/courses/${course._id}`} className="button secondary">
                  View details
                </Link>
                {user?.user?.role === 'student' && (
                  <button
                    type="button"
                    className="button primary"
                    onClick={() => handleEnroll(course._id)}
                    disabled={user?.user?.enrolledCourses?.includes(course._id)}
                  >
                    {user?.user?.enrolledCourses?.includes(course._id) ? 'Enrolled' : 'Enroll'}
                  </button>
                )}
              </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default Courses
