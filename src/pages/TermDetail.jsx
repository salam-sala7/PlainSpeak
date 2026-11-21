import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import TermCard from '../components/TermCard/TermCard'
import { readTerm } from '../features/terms/terms'

const termIdPattern = /^[\da-f]{8}(?:-[\da-f]{4}){3}-[\da-f]{12}$/i

function TermContents({ termId }) {
  const [result, setResult] = useState(null)

  useEffect(() => {
    const request = new AbortController()
    readTerm(termId, request.signal).then(
      term => { if (!request.signal.aborted) setResult({ term }) },
      error => { if (!request.signal.aborted) setResult({ error: error.message }) },
    )
    return () => request.abort()
  }, [termId])

  if (!result) return <p role="status">Loading term…</p>
  if (result.error) return <p role="alert">{result.error}</p>
  if (!result.term) return <h1>Term not found</h1>
  return <TermCard term={result.term} detail />
}

export default function TermDetail() {
  const { termId } = useParams()
  return (
    <section className="grid max-w-3xl gap-4">
      <Link className="w-fit underline" to="/terms">Back to glossary</Link>
      {termIdPattern.test(termId) ? <TermContents key={termId} termId={termId} /> : <h1>Term not found</h1>}
    </section>
  )
}
