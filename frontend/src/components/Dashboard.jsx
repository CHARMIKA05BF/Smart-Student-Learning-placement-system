import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const Dashboard = ({ user }) => {
  const [stats, setStats] = useState({ courses: 0, assignments: 0, jobs: 0, taught: 0, posted: 0 })
  const [ready, setReady] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) return

    const loadStats = async () => {
      try {
        const [coursesRes, jobsRes, assignmentsRes] = await Promise.all([
          fetch('/api/courses', { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch('/api/jobs', { headers: { Authorization: `Bearer ${user.token}` } }),
          fetch('/api/assignments', { headers: { Authorization: `Bearer ${user.token}` } }),
        ])

        const [coursesData, jobsData, assignmentsData] = await Promise.all([
          coursesRes.json(),
          jobsRes.json(),
          assignmentsRes.json(),
        ])

        const userId = user.user.id
        const taught = coursesData.filter((course) => {
          const trainerId = course.trainer?._id || course.trainer
          return trainerId === userId
        }).length
        const posted = jobsData.filter((job) => {
          const postedById = job.postedBy?._id || job.postedBy
          return postedById === userId
        }).length

        setStats({
          courses: user.user?.enrolledCourses?.length || 0,
          assignments: Array.isArray(assignmentsData) ? assignmentsData.length : 0,
          jobs: user.user?.appliedJobs?.length || 0,
          taught,
          posted,
        })
      } catch (error) {
        console.error('Dashboard stats failed', error)
      } finally {
        setReady(true)
      }
    }

    loadStats()
  }, [user])

  if (!user) {
    return <main className="page-shell dashboard-shell">Loading...</main>
  }

  const role = user.user.role || 'student'

  return (
    <main className="page-shell dashboard-shell">
      <section className="dashboard-hero">
        <div>
          <p className="eyebrow">Hello, {role === 'trainer' ? 'Trainer' : 'Student'}</p>
          <h1>{user.user.name}</h1>
          <p>
            Welcome to your personalized training platform. Use the quick actions below to manage courses,
            assignments, and placement opportunities.
          </p>
          <div className="hero-badges">
            <span className="badge">Role: {role}</span>
            <span className="badge secondary">{user.user.email}</span>
          </div>
          <div className="dashboard-actions">
            <button className="button primary" onClick={() => navigate('/courses')}>
              Browse courses
            </button>
            <button className="button secondary" onClick={() => navigate('/jobs')}>
              Explore jobs
            </button>
          </div>
        </div>
      </section>

      <section className="summary-grid">
        {role === 'trainer' ? (
          <>
            <article>
              <h2>Courses taught</h2>
              <p>{stats.taught}</p>
            </article>
            <article>
              <h2>Job posts</h2>
              <p>{stats.posted}</p>
            </article>
            <article>
              <h2>Assignments</h2>
              <p>{stats.assignments}</p>
            </article>
          </>
        ) : (
          <>
            <article>
              <h2>Enrolled courses</h2>
              <p>{stats.courses}</p>
            </article>
            <article>
              <h2>Assignments</h2>
              <p>{stats.assignments}</p>
            </article>
            <article>
              <h2>Applied jobs</h2>
              <p>{stats.jobs}</p>
            </article>
          </>
        )}
      </section>

      <section className="dashboard-panel">
        <h2>Quick actions</h2>
        <div className="panel-grid">
          {role === 'trainer' ? (
            <>
              <button className="button primary" onClick={() => navigate('/courses')}>
                Create or manage courses
              </button>
              <button className="button secondary" onClick={() => navigate('/jobs')}>
                Post new job
              </button>
            </>
          ) : (
            <>
              <button className="button primary" onClick={() => navigate('/courses')}>
                Find a course
              </button>
              <button className="button secondary" onClick={() => navigate('/jobs')}>
                Apply for jobs
              </button>
            </>
          )}
        </div>
      </section>
      {!ready && <p className="form-success">Loading latest dashboard data...</p>}
    </main>
  )
}

export default Dashboard
