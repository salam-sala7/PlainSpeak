import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'
import { useProfile } from '../features/profile/useProfile'
import './AccountPages.css'

export default function Profile() {
  const { session } = useAuth()
  const result = useProfile(session.user.id)

  if (!result) return <p role="status">Loading profile…</p>
  if (result.error) return <p role="alert">{result.error}</p>

  const { username, bio } = result.profile
  return (
    <section className="account-page">
      <header>
        <p className="account-eyebrow">Account</p>
        <h1>Profile</h1>
      </header>
      <section className="account-panel">
        <h2>{username}</h2>
        <p>{bio || 'Add a short bio in settings.'}</p>
        <Link to="/settings">Edit profile</Link>
      </section>
    </section>
  )
}
