import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import BirthdayCard from '../components/BirthdayCard'
import { getDaysUntil, sortByUpcoming } from '../utils/birthday'

export default function Dashboard() {
  const { currentUser, getBirthdays, saveBirthdays } = useAuth()
  const [birthdays, setBirthdays] = useState(() => getBirthdays())

  useEffect(() => { saveBirthdays(birthdays) }, [birthdays])

  const handleDelete = (id) => setBirthdays(prev => prev.filter(b => b.id !== id))
  const handleEdit = (id, data) => setBirthdays(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))

  const sorted = sortByUpcoming(birthdays)
  const todayList = sorted.filter(b => getDaysUntil(b.month, b.day) === 0)
  const week = sorted.filter(b => { const d = getDaysUntil(b.month, b.day); return d > 0 && d <= 7 })
  const thisMonth = birthdays.filter(b => b.month === new Date().getMonth() + 1).length
  const next = sorted.find(b => getDaysUntil(b.month, b.day) > 0)
  const nextDays = next ? getDaysUntil(next.month, next.day) : null

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })

  return (
    <div className="page">
      {todayList.length > 0 && (
        <div className="confetti-bar">🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊</div>
      )}

      <div className="dashboard-hero">
        <h1 className="welcome">Hey, <span className="welcome-name">{currentUser}</span>! 💕</h1>
        <p className="today-date">📅 {dateStr}</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🎂</div>
          <div className="stat-value">{birthdays.length}</div>
          <div className="stat-label">Total Friends</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{thisMonth}</div>
          <div className="stat-label">This Month</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">🎉</div>
          <div className="stat-value">{todayList.length}</div>
          <div className="stat-label">Today</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">{nextDays !== null ? `${nextDays}d` : '—'}</div>
          <div className="stat-label">{next ? next.name : 'No upcoming'}</div>
        </div>
      </div>

      {todayList.length > 0 && (
        <section>
          <h2 className="section-title">🎉 Today's Birthdays!</h2>
          {todayList.map(b => <BirthdayCard key={b.id} b={b} onDelete={handleDelete} onEdit={handleEdit} />)}
        </section>
      )}

      {week.length > 0 && (
        <section>
          <h2 className="section-title">⏰ Coming Up This Week</h2>
          {week.map(b => <BirthdayCard key={b.id} b={b} onDelete={handleDelete} onEdit={handleEdit} />)}
        </section>
      )}

      {birthdays.length === 0 ? (
        <div className="empty">
          <div className="empty-icon">🎈</div>
          <p>No birthdays added yet!</p>
          <p className="empty-sub">Head over to Birthdays to add your friends 🌷</p>
          <Link to="/birthdays" className="go-btn">Go to Birthdays →</Link>
        </div>
      ) : (
        week.length === 0 && todayList.length === 0 && (
          <div className="empty">
            <div className="empty-icon">✨</div>
            <p>No birthdays this week</p>
            <p className="empty-sub">
              {next ? `Next up: ${next.name} in ${nextDays} days 🌸` : 'Enjoy the calm! 🌸'}
            </p>
          </div>
        )
      )}

      {birthdays.length > 0 && (
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link to="/birthdays" className="view-all-btn">🎀 View All Birthdays ({birthdays.length})</Link>
        </div>
      )}
    </div>
  )
}
