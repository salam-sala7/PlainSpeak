import { useState } from 'react'
import { Link } from 'react-router-dom'
import PricingCard from '../PricingCard/PricingCard'
import { getSupabase } from '../../lib/supabase'

const plans = [
  { id: 'free', title: 'Free', features: ['Browse the glossary', 'Submit terms', 'Request demo consultations'] },
  { id: 'pro', title: 'Pro', features: ['All Free features', 'Demo access to Monetize services'] },
  { id: 'org', title: 'Organization', features: ['All Free features', 'Demo access to Monetize services', 'Organization tier'] },
]

export default function SubscriptionPlans({ initialTier }) {
  const [tier, setTier] = useState(initialTier)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const activePlan = plans.find(plan => plan.id === tier)

  async function choose(plan) {
    if (pending) return
    setPending(true)
    setError('')
    try {
      const { data, error: updateError } = await getSupabase().rpc('set_demo_subscription', { tier: plan })
      if (updateError) throw updateError
      setTier(data)
    } catch (failure) {
      setError(failure.message)
    } finally {
      setPending(false)
    }
  }

  return (
    <section className="my-6 space-y-4" aria-label="Demo subscription">
      <p role="status">
        {activePlan && <>Current plan: {activePlan.title}. </>}Demo plans do not charge you.
      </p>
      <div className="term-grid">
        {plans.map(({ id, title, features }) => (
          <PricingCard key={id} title={title} price="$0 · Demo" features={features} featured={id !== 'free'}>
            {activePlan ? (
              <button type="button" onClick={() => choose(id)} disabled={pending || tier === id}>
                {tier === id ? 'Current plan' : `Subscribe to ${title}`}
              </button>
            ) : (
              <Link className="underline" to="/login" state={{ from: '/pricing' }}>Log in to choose {title}</Link>
            )}
          </PricingCard>
        ))}
      </div>
      {error && <p role="alert">{error}</p>}
      {(tier === 'pro' || tier === 'org') && (
        <section className="rounded-xl border border-plain-border bg-white p-4">
          <h3 className="font-bold">Monetize services</h3>
          <p>Demo access is active for this plan.</p>
        </section>
      )}
    </section>
  )
}
