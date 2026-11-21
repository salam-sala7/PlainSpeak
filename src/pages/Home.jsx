import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchBar from '../components/SearchBar/SearchBar'
import { filterTerms } from '../features/terms/terms'
import TermCard from '../components/TermCard/TermCard'
import { getSupabase } from '../lib/supabase'
import './GlossaryEmptyState.css'

export default function Home() {
  const { state } = useLocation()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
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

  const results = filterTerms(terms, search, category)
  const hasFilters = Boolean(search.trim() || category)

  return (
    <section>
      <h1>Legal terms in plain language</h1>
      {state?.notice && <p role="status">{state.notice}</p>}
      <p>Browse community explanations and examples.</p>
      <SearchBar search={search} onSearch={setSearch} category={category} onCategory={setCategory} />
      {loading && <p role="status">Loading terms…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <div className="glossary-empty" role="status">
          <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7">
            <circle cx="10.5" cy="10.5" r="6" />
            <path d="m15 15 4.5 4.5" strokeLinecap="round" />
          </svg>
          <h2>{hasFilters ? 'No terms match' : 'No terms yet'}</h2>
          <p>{hasFilters ? 'Try a different search or submit this term.' : 'Community submissions will appear here.'}</p>
        </div>
      )}
      <div className="term-grid">{results.map(term => <TermCard key={term.id} term={term} />)}</div>
    </section>
  )
}
