import { useEffect, useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar.jsx'
import Home from './components/Home.jsx'
import AuthForm from './components/AuthForm.jsx'
import Dashboard from './components/Dashboard.jsx'
import Courses from './components/Courses.jsx'
import CourseDetail from './components/CourseDetail.jsx'
import Jobs from './components/Jobs.jsx'
import './App.css'

function App() {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('learning_user')
    return stored ? JSON.parse(stored) : null
  })

  useEffect(() => {
    const stored = localStorage.getItem('learning_user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const updateUser = (newUser) => {
    localStorage.setItem('learning_user', JSON.stringify(newUser))
    setUser(newUser)
  }

  const logout = () => {
    localStorage.removeItem('learning_user')
    setUser(null)
  }

  const PrivateRoute = ({ children }) => {
    return user ? children : <Navigate to="/login" replace />
  }

  return (
    <BrowserRouter>
      <Navbar user={user} onLogout={logout} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<AuthForm mode="login" setUser={updateUser} />} />
        <Route path="/register" element={<AuthForm mode="register" setUser={updateUser} />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard user={user} /></PrivateRoute>} />
        <Route path="/courses" element={<PrivateRoute><Courses user={user} setUser={updateUser} /></PrivateRoute>} />
        <Route path="/courses/:id" element={<PrivateRoute><CourseDetail user={user} setUser={updateUser} /></PrivateRoute>} />
        <Route path="/jobs" element={<PrivateRoute><Jobs user={user} setUser={updateUser} /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
