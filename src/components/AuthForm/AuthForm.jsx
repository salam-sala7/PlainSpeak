import { useState } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { getSupabase } from '../../lib/supabase'
import { useAuth } from '../../features/auth/authContext'

export default function AuthForm({ register = false }) {
  const { session, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')
  const [pending, setPending] = useState(false)
  const destination = location.state?.from ?? '/'

  async function submit(event) {
    event.preventDefault()
    if (pending) return
    setPending(true)
    setError('')
    setNotice('')
    const fields = new FormData(event.currentTarget)
    const credentials = { email: fields.get('email').trim(), password: fields.get('password') }

    try {
      const auth = getSupabase().auth
      const result = register
        ? await auth.signUp({ ...credentials, options: { data: { username: fields.get('username').trim() } } })
        : await auth.signInWithPassword(credentials)
      if (result.error) throw result.error
      if (register && !result.data.session) {
        setNotice('Check your email to confirm your account.')
        return
      }
      navigate(destination, { replace: true })
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending(false)
    }
  }

  if (loading) return <p role="status">Checking your session…</p>
  if (session) return <Navigate to={destination} replace />

  return (
    <section className="auth-page">
      <h1>{register ? 'Create an account' : 'Log in'}</h1>
      <form onSubmit={submit}>
        {register && <label>Username<input name="username" maxLength={50} autoComplete="nickname" required /></label>}
        <label>Email<input name="email" type="email" autoComplete="email" required /></label>
        <label>Password<input name="password" type="password" minLength={register ? 8 : undefined} autoComplete={register ? 'new-password' : 'current-password'} required /></label>
        {error && <p role="alert">{error}</p>}
        {notice && <p role="status">{notice}</p>}
        <button disabled={pending}>{pending ? 'Please wait…' : register ? 'Sign up' : 'Log in'}</button>
      </form>
      <p><Link to={register ? '/login' : '/register'} state={location.state}>{register ? 'Go to login' : 'Create an account'}</Link></p>
    </section>
  )
}
