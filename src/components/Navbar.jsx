import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Navbar() {
  const { currentUser, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <nav className="navbar">
      <div className="nav-brand">🎀 Birthday Reminder</div>
      <div className="nav-links">
        <NavLink to="/" end className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
          🏠 Dashboard
        </NavLink>
        <NavLink to="/birthdays" className={({ isActive }) => `nav-link ${isActive ? 'nav-active' : ''}`}>
          🎂 Birthdays
        </NavLink>
      </div>
      <div className="nav-user">
        <span className="nav-username">💖 {currentUser}</span>
        <button className="logout-btn" onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  )
}
