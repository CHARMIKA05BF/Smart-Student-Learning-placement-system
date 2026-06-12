import { useEffect, useState } from 'react'

const Jobs = ({ user, setUser }) => {
  const [jobs, setJobs] = useState([])
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [jobForm, setJobForm] = useState({ title: '', company: '', location: '', description: '' })

  const isTrainer = user?.user?.role === 'trainer'

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await fetch('/api/jobs', {
          headers: { Authorization: `Bearer ${user?.token}` },
        })
        const data = await response.json()
        if (response.ok) setJobs(data)
      } catch (err) {
        setError('Unable to load jobs')
      }
    }
    fetchJobs()
  }, [user])

  const apply = async (id) => {
    const response = await fetch(`/api/jobs/${id}/apply`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${user?.token}` },
    })
    const data = await response.json()
    setMessage(data.message || 'Application submitted')
    if (response.ok && setUser) {
      const stored = localStorage.getItem('learning_user')
      if (stored) {
        const storedData = JSON.parse(stored)
        const appliedJobs = new Set(storedData.user?.appliedJobs || [])
        appliedJobs.add(id)
        storedData.user.appliedJobs = Array.from(appliedJobs)
        localStorage.setItem('learning_user', JSON.stringify(storedData))
        setUser(storedData)
      }
    }
  }

  const createJob = async (e) => {
    e.preventDefault()
    setError('')
    setMessage('')

    try {
      const response = await fetch('/api/jobs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.token}`,
        },
        body: JSON.stringify(jobForm),
      })
      const data = await response.json()
      if (!response.ok) {
        setError(data.message || 'Unable to post job')
        return
      }
      setJobs([data, ...jobs])
      setJobForm({ title: '', company: '', location: '', description: '' })
      setMessage('Job posted successfully.')
    } catch (err) {
      setError('Unable to post job')
    }
  }

  return (
    <main className="page-shell content-shell">
      <section className="section-header">
        <div>
          <p className="eyebrow">Placement portal</p>
          <h1>Job opportunities</h1>
          <p>Search, apply, and track the latest placement openings for your role.</p>
        </div>
      </section>
      {error && <p className="form-error">{error}</p>}
      {message && <p className="form-success">{message}</p>}
      {isTrainer && (
        <section className="form-panel">
          <h2>Post a new job</h2>
          <form onSubmit={createJob} className="course-form">
            <label>
              Title
              <input
                type="text"
                name="title"
                value={jobForm.title}
                onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Company
              <input
                type="text"
                name="company"
                value={jobForm.company}
                onChange={(e) => setJobForm({ ...jobForm, company: e.target.value })}
                required
              />
            </label>
            <label>
              Location
              <input
                type="text"
                name="location"
                value={jobForm.location}
                onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
              />
            </label>
            <label>
              Description
              <textarea
                name="description"
                value={jobForm.description}
                onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                required
              />
            </label>
            <button type="submit" className="button primary">
              Post job
            </button>
          </form>
        </section>
      )}
      <section className="card-grid">
        {jobs.map((job) => (
          <article key={job._id} className="job-card">
            <div>
              <h2>{job.title}</h2>
              <p className="job-meta">{job.company} · {job.location}</p>
              <p>{job.description}</p>
                   <p className="course-meta">Posted by {job.postedBy?.name || 'Trainer'}</p>
            </div>
            {!isTrainer && (
              <button
                className="button primary"
                onClick={() => apply(job._id)}
                disabled={job.applicants?.some((app) => typeof app === 'string' ? app === user.user.id : app?._id === user.user.id)}
              >
                {job.applicants?.some((app) => typeof app === 'string' ? app === user.user.id : app?._id === user.user.id) ? 'Applied' : 'Apply now'}
              </button>
            )}
          </article>
        ))}
      </section>
    </main>
  )
}

export default Jobs
