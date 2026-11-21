import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import SearchBar from '../components/SearchBar/SearchBar'
import { filterTerms } from '../features/terms/terms'
import TermCard from '../components/TermCard/TermCard'
import { getSupabase } from '../lib/supabase'

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

  return (
    <section>
      <h1>Legal terms in plain language</h1>
      {state?.notice && <p role="status">{state.notice}</p>}
      <p>Browse community explanations and examples.</p>
      <SearchBar search={search} onSearch={setSearch} category={category} onCategory={setCategory} />
      {loading && <p role="status">Loading terms…</p>}
      {error && <p role="alert">{error}</p>}
      {!loading && !error && results.length === 0 && (
        <div className="empty-state" role="status">
          <h2>{search.trim() || category ? 'No terms match' : 'No terms yet'}</h2>
          <p>{search.trim() || category ? 'Try another word or choose a different category.' : 'Community submissions will appear here.'}</p>
        </div>
      )}
      <div className="term-grid">{results.map(term => <TermCard key={term.id} term={term} />)}</div>
    </section>
  )
}
