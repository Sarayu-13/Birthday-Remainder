import { useState, useEffect } from 'react'

const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

const AVATAR_EMOJIS = ['🧁', '🌸', '🦋', '🌷', '🍭', '🌈', '💖', '🦄', '🌺', '🍬', '🎀', '💐']

function getDaysUntilBirthday(month, day) {
  const today = new Date()
  const thisYear = today.getFullYear()
  let next = new Date(thisYear, month - 1, day)
  if (next < today) next = new Date(thisYear + 1, month - 1, day)
  const diff = Math.ceil((next - today) / (1000 * 60 * 60 * 24))
  return diff === 0 ? 0 : diff
}

function getZodiac(month, day) {
  const signs = [
    { sign: '♑ Capricorn', end: [1, 19] },
    { sign: '♒ Aquarius', end: [2, 18] },
    { sign: '♓ Pisces', end: [3, 20] },
    { sign: '♈ Aries', end: [4, 19] },
    { sign: '♉ Taurus', end: [5, 20] },
    { sign: '♊ Gemini', end: [6, 20] },
    { sign: '♋ Cancer', end: [7, 22] },
    { sign: '♌ Leo', end: [8, 22] },
    { sign: '♍ Virgo', end: [9, 22] },
    { sign: '♎ Libra', end: [10, 22] },
    { sign: '♏ Scorpio', end: [11, 21] },
    { sign: '♐ Sagittarius', end: [12, 21] },
    { sign: '♑ Capricorn', end: [12, 31] },
  ]
  for (const { sign, end } of signs) {
    if (month < end[0] || (month === end[0] && day <= end[1])) return sign
  }
  return ''
}

function BirthdayCard({ b, onDelete }) {
  const days = getDaysUntilBirthday(b.month, b.day)
  const isToday = days === 0
  const isSoon = days <= 7 && days > 0

  return (
    <div className={`card ${isToday ? 'card-today' : isSoon ? 'card-soon' : ''}`}>
      <div className="card-avatar">{b.avatar}</div>
      <div className="card-info">
        <div className="card-name">{b.name}</div>
        <div className="card-date">
          🗓️ {MONTHS[b.month - 1]} {b.day}
          <span className="card-zodiac">{getZodiac(b.month, b.day)}</span>
        </div>
        {isToday ? (
          <div className="card-badge today">🎉 Today is their birthday!</div>
        ) : isSoon ? (
          <div className="card-badge soon">⏰ In {days} day{days > 1 ? 's' : ''}!</div>
        ) : (
          <div className="card-days">💫 {days} days to go</div>
        )}
      </div>
      <button className="delete-btn" onClick={() => onDelete(b.id)} title="Remove">✕</button>
    </div>
  )
}

export default function App() {
  const [birthdays, setBirthdays] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('birthdays') || '[]')
    } catch {
      return []
    }
  })

  const [form, setForm] = useState({ name: '', month: '1', day: '1', avatar: AVATAR_EMOJIS[0] })
  const [showForm, setShowForm] = useState(false)
  const [search, setSearch] = useState('')
  const [confetti, setConfetti] = useState(false)

  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays))
  }, [birthdays])

  useEffect(() => {
    const hasToday = birthdays.some(b => getDaysUntilBirthday(b.month, b.day) === 0)
    if (hasToday) setConfetti(true)
  }, [birthdays])

  const handleAdd = () => {
    if (!form.name.trim()) return
    const newB = {
      id: Date.now(),
      name: form.name.trim(),
      month: parseInt(form.month),
      day: parseInt(form.day),
      avatar: form.avatar,
    }
    setBirthdays(prev => [...prev, newB])
    setForm({ name: '', month: '1', day: '1', avatar: AVATAR_EMOJIS[0] })
    setShowForm(false)
  }

  const handleDelete = (id) => {
    setBirthdays(prev => prev.filter(b => b.id !== id))
  }

  const daysInMonth = (month) => {
    const m = parseInt(month)
    return new Date(2024, m, 0).getDate()
  }

  const sorted = [...birthdays]
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => getDaysUntilBirthday(a.month, a.day) - getDaysUntilBirthday(b.month, b.day))

  const todayBirthdays = sorted.filter(b => getDaysUntilBirthday(b.month, b.day) === 0)
  const upcoming = sorted.filter(b => getDaysUntilBirthday(b.month, b.day) > 0)

  return (
    <div className="app">
      {confetti && <div className="confetti-bar">🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊🎀🎂🎊</div>}

      <header className="header">
        <div className="header-icon">🎀</div>
        <h1>Birthday Reminder</h1>
        <p className="subtitle">Never miss a special day 💕</p>
      </header>

      <div className="top-bar">
        <input
          className="search"
          placeholder="🔍 Search friends..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <button className="add-btn" onClick={() => setShowForm(v => !v)}>
          {showForm ? '✕ Cancel' : '+ Add Birthday'}
        </button>
      </div>

      {showForm && (
        <div className="form-card">
          <h2 className="form-title">🌸 Add a Birthday</h2>

          <label>Name</label>
          <input
            className="input"
            placeholder="Your friend's name 💖"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
          />

          <div className="row">
            <div className="field">
              <label>Month</label>
              <select
                className="input"
                value={form.month}
                onChange={e => {
                  const m = e.target.value
                  const maxDay = daysInMonth(m)
                  setForm(f => ({ ...f, month: m, day: Math.min(f.day, maxDay).toString() }))
                }}
              >
                {MONTHS.map((m, i) => (
                  <option key={m} value={i + 1}>{m}</option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Day</label>
              <select
                className="input"
                value={form.day}
                onChange={e => setForm(f => ({ ...f, day: e.target.value }))}
              >
                {Array.from({ length: daysInMonth(form.month) }, (_, i) => (
                  <option key={i + 1} value={i + 1}>{i + 1}</option>
                ))}
              </select>
            </div>
          </div>

          <label>Pick an emoji avatar</label>
          <div className="emoji-grid">
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                className={`emoji-btn ${form.avatar === e ? 'emoji-selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, avatar: e }))}
              >
                {e}
              </button>
            ))}
          </div>

          <button className="save-btn" onClick={handleAdd}>🎉 Save Birthday</button>
        </div>
      )}

      {todayBirthdays.length > 0 && (
        <section>
          <h2 className="section-title">🎂 Today's Birthdays!</h2>
          {todayBirthdays.map(b => <BirthdayCard key={b.id} b={b} onDelete={handleDelete} />)}
        </section>
      )}

      {upcoming.length > 0 && (
        <section>
          <h2 className="section-title">📅 Upcoming Birthdays</h2>
          {upcoming.map(b => <BirthdayCard key={b.id} b={b} onDelete={handleDelete} />)}
        </section>
      )}

      {birthdays.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🎈</div>
          <p>No birthdays yet!</p>
          <p className="empty-sub">Add your friends & never forget their special day 🌷</p>
        </div>
      )}

      {birthdays.length > 0 && sorted.length === 0 && (
        <div className="empty">
          <div className="empty-icon">🔍</div>
          <p>No results found</p>
        </div>
      )}

      <footer className="footer">made with 💖 for you</footer>
    </div>
  )
}
