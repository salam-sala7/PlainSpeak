import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import TermCard from '../components/TermCard/TermCard'
import { getSupabase } from '../lib/supabase'

export default function Home() {
  const { state } = useLocation()
  const [terms, setTerms] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const request = new AbortController()

    async function load() {
      try {
        const { data, error: queryError } = await getSupabase().from('terms')
          .select('id, jargon, translation, analogy, category')
          .order('created_at', { ascending: false })
          .order('id')
          .abortSignal(request.signal)
        if (queryError) throw queryError
        if (!request.signal.aborted) setTerms(data)
      } catch (failure) {
        if (!request.signal.aborted) setError(failure.message)
      } finally {
        if (!request.signal.aborted) setLoading(false)
      }
    }

    load()
    return () => request.abort()
  }, [])

  return (
    <section>
      <h1>Legal terms in plain language</h1>
      {state?.notice && <p role="status">{state.notice}</p>}
      <p>Browse community explanations and examples.</p>
      {loading && <p role="status">Loading terms…</p>}
      {error && <p role="alert">{error}</p>}
      <div className="term-grid">{terms.map(term => <TermCard key={term.id} term={term} />)}</div>
    </section>
  )
}
