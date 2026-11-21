import SubscriptionPlans from '../components/SubscriptionPlans/SubscriptionPlans'
import { useAuth } from '../features/auth/authContext'
import { useProfile } from '../features/profile/useProfile'

function AccountPlans({ userId }) {
  const result = useProfile(userId)
  if (!result) return <p role="status">Loading your plan…</p>
  if (result.error) return <p role="alert">{result.error}</p>
  return <SubscriptionPlans initialTier={result.profile.subscription_tier} />
}

export default function Pricing() {
  const { session, loading } = useAuth()
  let content = <SubscriptionPlans />
  if (loading) content = <p role="status">Checking your session…</p>
  else if (session) content = <AccountPlans key={session.user.id} userId={session.user.id} />
  return <section><h1>Pricing</h1>{content}</section>
}
