import { useState } from 'react'
import { MONTHS, AVATAR_EMOJIS, getDaysUntil, getZodiac, daysInMonth } from '../utils/birthday'

export default function BirthdayCard({ b, onDelete, onEdit }) {
  const [editing, setEditing] = useState(false)
  const [form, setForm] = useState({ name: b.name, month: b.month, day: b.day, avatar: b.avatar })

  const days = getDaysUntil(b.month, b.day)
  const isToday = days === 0
  const isSoon = days <= 7 && days > 0

  const handleSave = () => {
    if (!form.name.trim()) return
    onEdit(b.id, { ...form, month: parseInt(form.month), day: parseInt(form.day) })
    setEditing(false)
  }

  if (editing) {
    return (
      <div className="card card-editing">
        <div className="edit-form">
          <input
            className="input"
            value={form.name}
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
            placeholder="Name"
          />
          <div className="row" style={{ gap: '8px', marginTop: '8px' }}>
            <select
              className="input"
              value={form.month}
              onChange={e => {
                const m = e.target.value
                setForm(f => ({ ...f, month: m, day: Math.min(parseInt(f.day), daysInMonth(m)) }))
              }}
            >
              {MONTHS.map((m, i) => <option key={m} value={i + 1}>{m}</option>)}
            </select>
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
          <div className="emoji-grid" style={{ marginTop: '10px' }}>
            {AVATAR_EMOJIS.map(e => (
              <button
                key={e}
                className={`emoji-btn ${form.avatar === e ? 'emoji-selected' : ''}`}
                onClick={() => setForm(f => ({ ...f, avatar: e }))}
              >{e}</button>
            ))}
          </div>
          <div className="edit-actions">
            <button className="save-btn" style={{ marginTop: '10px', padding: '8px 20px', width: 'auto' }} onClick={handleSave}>
              💾 Save
            </button>
            <button className="cancel-edit-btn" onClick={() => { setEditing(false); setForm({ name: b.name, month: b.month, day: b.day, avatar: b.avatar }) }}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    )
  }

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
          <div className="card-days">💫 {days} day{days !== 1 ? 's' : ''} to go</div>
        )}
      </div>
      <div className="card-actions">
        <button className="edit-btn" onClick={() => setEditing(true)} title="Edit">✏️</button>
        <button className="delete-btn" onClick={() => onDelete(b.id)} title="Delete">✕</button>
      </div>
    </div>
  )
}
