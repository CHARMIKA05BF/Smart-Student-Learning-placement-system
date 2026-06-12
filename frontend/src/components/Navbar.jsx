import { Link } from 'react-router-dom'

const Navbar = ({ user, onLogout }) => {
  return (
    <header className="site-header">
      <div className="brand">Smart Learning</div>
      <nav>
        <Link to="/">Home</Link>
        <Link to="/courses">Courses</Link>
        <Link to="/jobs">Jobs</Link>
        <Link to="/dashboard">Dashboard</Link>
        {user ? (
          <button type="button" onClick={onLogout}>Logout</button>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
    </header>
  )
}

export default Navbar
