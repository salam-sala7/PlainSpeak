import BioCard from '../components/BioCard/BioCard'
import UserTermsList from '../components/UserTermsList/UserTermsList'
import { useAuth } from '../features/auth/authContext'
import { useProfile } from '../features/profile/useProfile'

export default function Profile() {
  const { session } = useAuth()
  const userId = session.user.id
  const result = useProfile(userId)

  if (!result) return <p role="status">Loading profile…</p>
  if (result.error) return <p role="alert">{result.error}</p>

  return (
    <section className="space-y-6">
      <BioCard profile={result.profile} />
      <UserTermsList key={userId} userId={userId} />
    </section>
  )
}
