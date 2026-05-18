import { useState } from 'react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const [tab, setTab] = useState('login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const { login, signup } = useAuth()

  const handleSubmit = () => {
    setError('')
    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields!')
      return
    }
    const result = tab === 'login' ? login(username.trim(), password) : signup(username.trim(), password)
    if (result.error) setError(result.error)
  }

  const switchTab = (t) => {
    setTab(t)
    setError('')
    setUsername('')
    setPassword('')
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-icon">🎀</div>
        <h1 className="login-title">Birthday Reminder</h1>
        <p className="login-sub">Your personal birthday tracker 💕</p>

        <div className="tab-row">
          <button className={`tab-btn ${tab === 'login' ? 'tab-active' : ''}`} onClick={() => switchTab('login')}>
            Login
          </button>
          <button className={`tab-btn ${tab === 'signup' ? 'tab-active' : ''}`} onClick={() => switchTab('signup')}>
            Sign Up
          </button>
        </div>

        <label>Username</label>
        <input
          className="input"
          placeholder="e.g. sarayu 🌸"
          value={username}
          onChange={e => setUsername(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
          autoFocus
        />

        <label style={{ marginTop: '12px' }}>Password</label>
        <input
          className="input"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={e => setPassword(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />

        {error && <div className="error-msg">⚠️ {error}</div>}

        <button className="save-btn" style={{ marginTop: '20px' }} onClick={handleSubmit}>
          {tab === 'login' ? '✨ Login' : '🌸 Create Account'}
        </button>

        <p className="login-hint">
          {tab === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <button className="link-btn" onClick={() => switchTab(tab === 'login' ? 'signup' : 'login')}>
            {tab === 'login' ? 'Sign up' : 'Login'}
          </button>
        </p>
      </div>
    </div>
  )
}
