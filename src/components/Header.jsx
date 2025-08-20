import React, { useState } from 'react'
import { signIn, signUp, signOut } from '../services/syncService.js'

export default function Header({ user }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [mode, setMode] = useState('login') // or signup
  const [busy, setBusy] = useState(false)
  const [msg, setMsg] = useState('')

  async function handleAuth(e) {
    e.preventDefault()
    setBusy(true); setMsg('')
    try {
      if (mode === 'login') {
        const { error } = await signIn(email, password)
        if (error) setMsg(error.message || 'Login failed')
        else setMsg('Logged in')
      } else {
        const { error } = await signUp(email, password)
        if (error) setMsg(error.message || 'Signup failed')
        else setMsg('Signed up. Check your email if confirmation is required.')
      }
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="header">
      <div className="brand">
        <h1>AetherNote</h1>
        <span className="muted">Offline-first notes with optional sync</span>
      </div>

      {!user ? (
        <form className="auth row" onSubmit={handleAuth}>
          <input
            className="grow"
            type="email"
            required
            placeholder="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input
            type="password"
            required
            placeholder="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button className="btn primary" disabled={busy} type="submit">
            {mode === 'login' ? 'Login' : 'Sign up'}
          </button>
          <button type="button" className="btn" onClick={() => setMode(m => m === 'login' ? 'signup' : 'login')}>
            {mode === 'login' ? 'Need an account?' : 'Have an account?'}
          </button>
          {msg && <span className="pill">{msg}</span>}
        </form>
      ) : (
        <div className="auth">
          <span className="pill">Signed in: {user.email}</span>
          <button className="btn" onClick={() => signOut()}>Logout</button>
        </div>
      )}
    </div>
  )
}