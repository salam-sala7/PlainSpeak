import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { readUserTerms } from '../../features/terms/terms'
import TermCard from '../TermCard/TermCard'

export default function UserTermsList({ userId }) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const request = new AbortController()
    readUserTerms(userId, request.signal).then(
      terms => { if (!request.signal.aborted) setResult({ terms }) },
      error => { if (!request.signal.aborted) setResult({ error: error.message }) },
    )
    return () => request.abort()
  }, [userId])

  return (
    <section className="space-y-3" aria-labelledby="profile-terms">
      <h2 id="profile-terms" className="text-xl font-bold">Your terms</h2>
      {!result && <p role="status">Loading terms…</p>}
      {result?.error && <p role="alert">{result.error}</p>}
      {result?.terms?.length === 0 && <p>You have no terms yet. <Link className="underline" to="/submit">Submit a term</Link>.</p>}
      {result?.terms?.length > 0 && (
        <div className="term-grid">{result.terms.map(term => <TermCard key={term.id} term={term} />)}</div>
      )}
    </section>
  )
}
