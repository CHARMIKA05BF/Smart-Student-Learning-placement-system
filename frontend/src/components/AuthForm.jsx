import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'

const AuthForm = ({ mode, setUser }) => {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'student' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const submitTo = mode === 'register' ? '/api/auth/register' : '/api/auth/login'

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const body = mode === 'register' ? form : { email: form.email, password: form.password }
    const response = await fetch(submitTo, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })

    const data = await response.json()
    if (!response.ok) {
      setError(data.message || 'Unable to complete request')
      setLoading(false)
      return
    }

    // If backend provided token, fetch latest profile to include enrolled/applied arrays
    const token = data.token
    let payload = data
    try {
      if (token) {
        const prof = await fetch('/api/auth/profile', { headers: { Authorization: `Bearer ${token}` } })
        const profData = await prof.json()
        if (prof.ok) {
          payload = { user: profData.user, token }
        } else {
          // fallback to server response
          payload = data
        }
      }
    } catch (err) {
      // ignore profile fetch failure and use initial response
      payload = data
    }

    localStorage.setItem('learning_user', JSON.stringify(payload))
    setUser?.(payload)
    setLoading(false)
    navigate('/dashboard')
  }

  return (
    <main className="page-shell auth-shell">
      <div className="auth-card">
        <h1>{mode === 'register' ? 'Create account' : 'Welcome back'}</h1>
        <p>{mode === 'register' ? 'Register to start learning and applying.' : 'Login to access your dashboard.'}</p>
        <form onSubmit={handleSubmit}>
          {mode === 'register' && (
            <label>
              Name
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={handleChange} required minLength={6} />
          </label>
          {mode === 'register' && (
            <label>
              Role
              <select name="role" value={form.role} onChange={handleChange}>
                <option value="student">Student</option>
                <option value="trainer">Trainer</option>
              </select>
            </label>
          )}
          {error && <p className="form-error">{error}</p>}
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? (mode === 'register' ? 'Registering…' : 'Signing in…') : (mode === 'register' ? 'Sign up' : 'Login')}
          </button>
        </form>
        <p className="notice" style={{ marginTop: '18px' }}>
          {mode === 'register' ? 'Already have an account?' : 'New here?'}{' '}
          <Link to={mode === 'register' ? '/login' : '/register'}>
            {mode === 'register' ? 'Login' : 'Create account'}
          </Link>
        </p>
      </div>
    </main>
  )
}

export default AuthForm
