import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

const CourseDetail = ({ user, setUser }) => {
  const { id } = useParams()
  const [course, setCourse] = useState(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    const loadCourse = async () => {
      const response = await fetch(`/api/courses/${id}`, {
        headers: { Authorization: `Bearer ${user?.token}` },
      })
      const data = await response.json()
      if (response.ok) setCourse(data)
      else setError(data.message || 'Course not found')
    }
    loadCourse()
  }, [id, user])

  const handleEnroll = async () => {
    setMessage('')
    setError('')

    const response = await fetch(`/api/courses/${id}/enroll`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user?.token}` },
    })
    const data = await response.json()
    if (!response.ok) {
      setError(data.message || 'Enrollment failed')
      return
    }
    setMessage(data.message || 'Enrolled successfully')

    const stored = localStorage.getItem('learning_user')
    if (stored) {
      const storedData = JSON.parse(stored)
      const enrolledSet = new Set(storedData.user?.enrolledCourses || [])
      enrolledSet.add(course._id)
      storedData.user.enrolledCourses = Array.from(enrolledSet)
      localStorage.setItem('learning_user', JSON.stringify(storedData))
      if (setUser) setUser(storedData)
    }
  }

  if (!course) {
    return <main className="page-shell"><p>Loading course...</p></main>
  }

  return (
    <main className="page-shell content-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Course detail</p>
          <h1>{course.title}</h1>
          <p>{course.description}</p>
        </div>
      </section>

      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}

      <section className="course-detail-grid">
        <article className="detail-panel">
          <h2>Trainer</h2>
          <p>{course.trainer?.name || 'Unknown'}</p>
          <h2>Content</h2>
          <p>{course.content || 'Course outline and lectures will appear here.'}</p>
        </article>
        <aside className="detail-actions">
          <button
            className="button primary"
            onClick={handleEnroll}
            disabled={user?.user?.enrolledCourses?.includes(course._id) || user?.user?.role === 'trainer'}
          >
            {user?.user?.enrolledCourses?.includes(course._id) ? 'Already enrolled' : user?.user?.role === 'trainer' ? 'Trainer cannot enroll' : 'Enroll in course'}
          </button>
          <p className="course-meta">{course.students?.length || 0} students enrolled</p>
        </aside>
      </section>
    </main>
  )
}

export default CourseDetail
