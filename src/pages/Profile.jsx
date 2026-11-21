import { Link } from 'react-router-dom'
import { useAuth } from '../features/auth/authContext'
import { useProfile } from '../features/profile/useProfile'

export default function Profile() {
  const { session } = useAuth()
  const result = useProfile(session.user.id)

  if (!result) return <p role="status">Loading profile…</p>
  if (result.error) return <p role="alert">{result.error}</p>

  const { username, bio } = result.profile
  return (
    <section>
      <h1>{username}</h1>
      <p>{bio || 'Add a short bio in settings.'}</p>
      <Link to="/settings">Edit profile</Link>
    </section>
  )
}
