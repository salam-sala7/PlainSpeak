import { useState } from 'react'
import { getSupabase } from '../../lib/supabase'

const plans = { free: 'Free', pro: 'Pro', org: 'Organization' }

export default function SubscriptionPlans({ initialTier }) {
  const [tier, setTier] = useState(initialTier)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

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
    <section>
      <h2>Demo subscription</h2>
      <p role="status">Current plan: {plans[tier]}. Demo plans do not charge you.</p>
      <div className="plan-options">
        {Object.entries(plans).map(([plan, label]) => <button key={plan} type="button"
          onClick={() => choose(plan)} disabled={pending || tier === plan}>
          {tier === plan ? label : `Subscribe to ${label}`}
        </button>)}
      </div>
      {error && <p role="alert">{error}</p>}
      {(tier === 'pro' || tier === 'org') && <section>
        <h3>Monetize services</h3>
        <p>Demo access is active for this plan.</p>
      </section>}
    </section>
  )
}
