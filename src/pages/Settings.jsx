import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'
import { saveProfile } from '../features/profile/profile'
import { useProfile } from '../features/profile/useProfile'
import { getSupabase } from '../lib/supabase'
import './AccountPages.css'

export default function Settings() {
  const { session } = useAuth()
  const id = session.user.id
  const result = useProfile(id)
  const navigate = useNavigate()
  const [notice, setNotice] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState('')

  async function save(event) {
    event.preventDefault()
    if (pending) return
    const fields = new FormData(event.currentTarget)
    const username = fields.get('username').trim()
    if (!username) {
      setError('Enter a username.')
      return
    }

    setPending('save')
    setError('')
    setNotice('')
    try {
      await saveProfile(id, { username, bio: fields.get('bio').trim() })
      setNotice('Profile saved.')
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending('')
    }
  }

  async function signOut() {
    setPending('logout')
    setError('')
    try {
      const { error: authError } = await getSupabase().auth.signOut()
      if (authError) throw authError
      navigate('/', { replace: true })
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending('')
    }
  }

  return (
    <section className="account-page">
      <header>
        <p className="account-eyebrow">Account</p>
        <h1>Settings</h1>
        <p>Manage your profile and account.</p>
      </header>
      <Link to="/profile">Back to profile</Link>
      {!result && <p role="status">Loading profile…</p>}
      {result?.error && <p role="alert">{result.error}</p>}
      {result?.profile && (
        <section className="account-panel" aria-labelledby="account-profile-title">
          <h2 id="account-profile-title">Profile</h2>
          <form className="account-form" key={id} onSubmit={save}>
            <label>Display name<input name="username" defaultValue={result.profile.username} maxLength={50} required /></label>
            <label>Email address<input type="email" value={session.user.email ?? ''} readOnly /></label>
            <label className="account-full-row">Bio<textarea name="bio" defaultValue={result.profile.bio} maxLength={1000} rows={3} /></label>
            <button disabled={Boolean(pending)}>{pending === 'save' ? 'Saving…' : 'Save'}</button>
          </form>
        </section>
      )}
      {error && <p role="alert">{error}</p>}
      {notice && <p role="status">{notice}</p>}
      <p><button type="button" onClick={signOut} disabled={Boolean(pending)}>Log out</button></p>
    </section>
  )
}
