import { createContext, useContext, useState } from 'react'

const AuthContext = createContext()

const getUsers = () => {
  try { return JSON.parse(localStorage.getItem('br_users') || '{}') }
  catch { return {} }
}

const saveUsers = (users) => localStorage.setItem('br_users', JSON.stringify(users))

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(() => localStorage.getItem('br_current_user') || null)

  const login = (username, password) => {
    const users = getUsers()
    if (!users[username]) return { error: 'Username not found 😢' }
    if (users[username].password !== password) return { error: 'Wrong password 🙈' }
    localStorage.setItem('br_current_user', username)
    setCurrentUser(username)
    return { success: true }
  }

  const signup = (username, password) => {
    if (username.trim().length < 2) return { error: 'Username must be at least 2 characters!' }
    if (password.length < 4) return { error: 'Password must be at least 4 characters!' }
    const users = getUsers()
    if (users[username]) return { error: 'Username already taken 💔' }
    users[username] = { password, birthdays: [] }
    saveUsers(users)
    localStorage.setItem('br_current_user', username)
    setCurrentUser(username)
    return { success: true }
  }

  const logout = () => {
    localStorage.removeItem('br_current_user')
    setCurrentUser(null)
  }

  const getBirthdays = () => {
    const users = getUsers()
    return users[currentUser]?.birthdays || []
  }

  const saveBirthdays = (birthdays) => {
    const users = getUsers()
    if (users[currentUser]) {
      users[currentUser].birthdays = birthdays
      saveUsers(users)
    }
  }

  return (
    <AuthContext.Provider value={{ currentUser, login, signup, logout, getBirthdays, saveBirthdays }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
