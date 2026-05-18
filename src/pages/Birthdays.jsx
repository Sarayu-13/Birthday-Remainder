import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import BirthdayCard from '../components/BirthdayCard'
import { getDaysUntil, sortByUpcoming, MONTHS, AVATAR_EMOJIS, daysInMonth } from '../utils/birthday'

export default function Birthdays() {
  const { getBirthdays, saveBirthdays } = useAuth()
  const [birthdays, setBirthdays] = useState(() => getBirthdays())
  const [search, setSearch] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', month: '1', day: '1', avatar: AVATAR_EMOJIS[0] })
  const [filter, setFilter] = useState('all')

  useEffect(() => { saveBirthdays(birthdays) }, [birthdays])

  const handleAdd = () => {
    if (!form.name.trim()) return
    setBirthdays(prev => [...prev, {
      id: Date.now(),
      name: form.name.trim(),
      month: parseInt(form.month),
      day: parseInt(form.day),
      avatar: form.avatar
    }])
    setForm({ name: '', month: '1', day: '1', avatar: AVATAR_EMOJIS[0] })
    setShowForm(false)
  }

  const handleDelete = (id) => setBirthdays(prev => prev.filter(b => b.id !== id))
  const handleEdit = (id, data) => setBirthdays(prev => prev.map(b => b.id === id ? { ...b, ...data } : b))

  const currentMonth = new Date().getMonth() + 1

  let filtered = sortByUpcoming(birthdays)
    .filter(b => b.name.toLowerCase().includes(search.toLowerCase()))

  if (filter === 'soon') filtered = filtered.filter(b => getDaysUntil(b.month, b.day) <= 30)
  if (filter === 'month') filtered = filtered.filter(b => b.month === currentMonth)

  return (
    <div className="page">
      <div className="page-header">
        <h1 className="page-title">🎂 All Birthdays</h1>
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
            autoFocus
          />

          <div className="row" style={{ gap: '12px' }}>
            <div className="field">
              <label>Month</label>
              <select
                className="input"
                value={form.month}
                onChange={e => {
                  const m = e.target.value
                  setForm(f => ({ ...f, month: m, day: Math.min(parseInt(f.day), daysInMonth(m)).toString() }))
                }}
              >
                {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
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
              >{e}</button>
            ))}
          </div>

          <button className="save-btn" onClick={handleAdd}>🎉 Save Birthday</button>
        </div>
      )}

      <div className="filter-bar">
        <input
          className="search"
          placeholder="🔍 Search friends..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="filter-pills">
          <button className={`pill ${filter === 'all' ? 'pill-active' : ''}`} onClick={() => setFilter('all')}>All</button>
          <button className={`pill ${filter === 'month' ? 'pill-active' : ''}`} onClick={() => setFilter('month')}>This Month 📅</button>
          <button className={`pill ${filter === 'soon' ? 'pill-active' : ''}`} onClick={() => setFilter('soon')}>Next 30 Days ⏰</button>
        </div>
      </div>

      {filtered.length > 0 ? (
        filtered.map(b => <BirthdayCard key={b.id} b={b} onDelete={handleDelete} onEdit={handleEdit} />)
      ) : (
        <div className="empty">
          <div className="empty-icon">{birthdays.length === 0 ? '🎈' : '🔍'}</div>
          <p>{birthdays.length === 0 ? 'No birthdays yet!' : 'No results found'}</p>
          {birthdays.length === 0 && <p className="empty-sub">Add your friends & never forget their special day 🌷</p>}
        </div>
      )}
    </div>
  )
}
